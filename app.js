// --- Application State ---
let pyodide = null;
let editor = null;
let currentTaskData = null; // Holds { meta, descriptionText, starterCode, evaluatorPy, tests }
let tagsList = [];
let tasksCatalog = [];
let activeTabFilename = "starter.py";
let isSharedLoaded = false;

const STORAGE_PREFIX = "judge_code_task_";

// --- DOM Elements ---
const filterSelect = document.getElementById("tagSelect");
const problemSelect = document.getElementById("taskSelect");
const descriptionElem = document.getElementById("taskDescription");
const outputElem = document.getElementById("outputConsole");
const runBtn = document.getElementById("runBtn");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const fileInput = document.getElementById("fileInput");
const editorTabsElem = document.getElementById("editorTabs");
const editorContainerElem = document.getElementById("editor-wrapper");
const readonlyViewElem = document.getElementById("readonlyFileView");
const readonlyCodeContentElem = document.getElementById("readonlyCodeContent");
const nicknameSetBtn = document.getElementById("nicknameSetBtn");

// --- History Modal Event Listeners ---
const viewHistoryBtn = document.getElementById("viewHistoryBtn");
const historyModal = document.getElementById("historyModal");
const closeHistoryBtn = document.getElementById("closeHistoryBtn");

if (viewHistoryBtn) {
  viewHistoryBtn.addEventListener("click", openSubmissionHistory);
}

if (closeHistoryBtn) {
  closeHistoryBtn.addEventListener("click", () => {
    historyModal.classList.add("hidden");
  });
}

// --- Leaderboard State ---
let currentLeaderboardTab = "time";
let cachedLeaderboardEntries = [];
let currentLeaderboardUsername = "";

// Helper: Simple Markdown Parser
function parseMarkdown(md) {
  if (!md) return '';

  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$2</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<br><br>');
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return await res.text();
}

// Helper to wait for Firebase module scripts to attach to window
async function waitForFirebase() {
  let attempts = 0;
  while (!window.fetchTaskLeaderboard && attempts < 20) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
}

// --- 1. Initialization ---
async function initApp() {
  // Initialize CodeMirror
  editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
    mode: "python",
    theme: "dracula",
    lineNumbers: true,
    indentUnit: 4,
    smartIndent: true,
    autofocus: true,
  });

  // Auto-save on edit
  editor.on("change", () => {
    if (currentTaskData && currentTaskData.meta) {
      saveCodeToLocalStorage(currentTaskData.meta.id);
    }
  });

  // Load username
  loadUsername();

  // Event Listeners
  runBtn.addEventListener("click", () => executeSuite(false));
  submitBtn.addEventListener("click", handleSubmit);
  resetBtn.addEventListener("click", resetCodeToStarter);
  saveBtn.addEventListener("click", saveCodeToFile);
  loadBtn.addEventListener("click", () => fileInput.click());
  nicknameSetBtn.addEventListener("click", lockUsername);
  fileInput.addEventListener("change", loadCodeFromFile);

  filterSelect.addEventListener("change", (e) => {
    const selectedTag = e.target.value;
    renderTaskList(selectedTag);

    if (problemSelect.value !== "") {
      const taskIdx = parseInt(problemSelect.value, 10);
      if (tasksCatalog[taskIdx]) {
        loadTaskFolder(tasksCatalog[taskIdx]);
      }
    }
  });

  problemSelect.addEventListener("change", (e) => onProblemSelectChange(e));

  // Load Catalog & Pyodide concurrently
  await Promise.all([initPyodide(), loadCatalog()]);
}

async function onProblemSelectChange(e) {
  const selectedTask = tasksCatalog[e.target.value];
  if (selectedTask) {
    await loadTaskFolder(selectedTask);

    const currentUsername = document.getElementById("nicknameInput").value.trim();
    const taskId = (selectedTask.meta && selectedTask.meta.id) ? selectedTask.meta.id : selectedTask.id;

    await loadAndRenderLeaderboard(taskId, currentUsername);
  }
}

async function initPyodide() {
  try {
    outputElem.innerText = "Loading Pyodide environment...";
    pyodide = await loadPyodide();
    await loadSharedPythonModules();
    outputElem.innerText = "Ready! Select a task to begin.";
  } catch (err) {
    outputElem.innerText = `❌ Failed to initialize Python runtime: ${err}`;
  }
}

// --- 2. Parallel Test Loading ---
async function loadSharedPythonModules() {
  if (isSharedLoaded || !pyodide) return;

  try {
    const response = await fetch("tasks/complexity_estimator.py");
    if (!response.ok) {
      throw new Error(`Failed to load shared estimator: ${response.statusText}`);
    }

    const estimatorCode = await response.text();

    pyodide.FS.mkdirTree("/home/pyodide/shared");
    pyodide.FS.writeFile("/home/pyodide/shared/complexity_estimator.py", estimatorCode);

    await pyodide.runPythonAsync(`
      import sys
      if "/home/pyodide/shared" not in sys.path:
        sys.path.append("/home/pyodide/shared")
    `);

    isSharedLoaded = true;
    console.log("✅ Shared Python modules loaded successfully into Pyodide.");
  } catch (err) {
    console.error("❌ Error loading shared Python module:", err);
  }
}

async function loadTestCases(folderPath, testCount) {
  if (!testCount || testCount <= 0) return [];

  const testPromises = [];

  for (let i = 1; i <= testCount; i++) {
    const testPromise = (async () => {
      try {
        const input = await fetchText(`${folderPath}/tests/${i}.in`);
        const expectedOutput = await fetchText(`${folderPath}/tests/${i}.out`);
        return { id: String(i), input, expectedOutput };
      } catch (err) {
        return null;
      }
    })();

    testPromises.push(testPromise);
  }

  const results = await Promise.all(testPromises);
  return results.filter(test => test !== null);
}

// --- 3. Task Folder Loader ---
async function loadCatalog() {
  try {
    const response = await fetch('tasks.json');
    if (!response.ok) throw new Error("Could not find tasks.json");

    tasksCatalog = await response.json();

    tasksCatalog.forEach(task => {
      if (Array.isArray(task.tags)) {
        task.tags.forEach(tag => {
          if (!tagsList.includes(tag)) {
            tagsList.push(tag);
          }
        });
      }
    });
    tagsList.sort();

    filterSelect.innerHTML = '<option value="ALL">すべてのタグ (All Tags)</option>' + tagsList.map(tag => `<option value="${tag}">${tag}</option>`).join('');

    renderTaskList("ALL");

    if (problemSelect.value !== "") {
      const taskIdx = parseInt(problemSelect.value, 10);
      await loadTaskFolder(tasksCatalog[taskIdx]);

      // Check initial task leaderboard after Firebase loads
      await waitForFirebase();
      const currentUsername = document.getElementById("nicknameInput").value.trim();
      const taskId = tasksCatalog[taskIdx].meta ? tasksCatalog[taskIdx].meta.id : tasksCatalog[taskIdx].id;
      await loadAndRenderLeaderboard(taskId, currentUsername);
    }
  } catch (err) {
    descriptionElem.innerText = "Error loading tasks catalog.";
    outputElem.innerText = err.message;
  }
}

async function loadTaskFolder(taskMeta) {
  outputElem.innerText = "Loading task resources...";
  runBtn.disabled = true;
  submitBtn.disabled = true;

  const folderPath = `tasks/${taskMeta.id}`;

  try {
    const [descText, starterText, evalText] = await Promise.all([
      fetchText(`${folderPath}/description.md`),
      fetchText(`${folderPath}/starter.py`),
      fetchText(`${folderPath}/evaluator.py`)
    ]);

    const supportPromises = taskMeta.supportFiles
      ? taskMeta.supportFiles.map(async (filename) => {
        const content = await fetchText(`${folderPath}/${filename}`);
        return { filename, content };
      })
      : [];

    const supportFiles = await Promise.all(supportPromises);

    const count = taskMeta.testCount;
    const testCases = await loadTestCases(folderPath, count);

    currentTaskData = {
      meta: taskMeta,
      descriptionMarkdown: descText,
      starterCode: starterText,
      evaluatorPy: evalText,
      supportFiles: supportFiles,
      tests: testCases
    };

    descriptionElem.innerHTML = parseMarkdown(currentTaskData.descriptionMarkdown);
    loadCodeForTask(currentTaskData);
    switchTab("starter.py");

    if (pyodide) {
      runBtn.disabled = false;
      submitBtn.disabled = false;
    }

    outputElem.innerText = `Task '${taskMeta.title}' loaded (${testCases.length} test case(s) found). Ready.`;
  } catch (err) {
    outputElem.innerText = `❌ [Error loading task folder]\n${err.message}`;
  }
}

function renderTaskList(selectedTag = "ALL") {
  const matchingTasks = tasksCatalog.filter(task => {
    if (selectedTag === "ALL") return true;
    return task.tags && task.tags.includes(selectedTag);
  });

  if (matchingTasks.length === 0) {
    problemSelect.innerHTML = '<option value="">該当する課題がありません</option>';
    return;
  }

  problemSelect.innerHTML = matchingTasks.map(task => {
    const originalIdx = tasksCatalog.findIndex(t => t.id === task.id);
    return `<option value="${originalIdx}">${task.title}</option>`;
  }).join('');
}

function renderEditorTabs() {
  if (!editorTabsElem || !currentTaskData) return;

  editorTabsElem.innerHTML = "";

  const mainTab = document.createElement("button");
  mainTab.className = `editor-tab ${activeTabFilename === "starter.py" ? "active" : ""}`;
  mainTab.innerText = "starter.py";
  mainTab.onclick = () => switchTab("starter.py");
  editorTabsElem.appendChild(mainTab);

  if (currentTaskData.supportFiles && currentTaskData.supportFiles.length > 0) {
    currentTaskData.supportFiles.forEach(file => {
      const tab = document.createElement("button");
      const isActive = activeTabFilename === file.filename;
      tab.className = `editor-tab ${isActive ? "active" : ""}`;
      tab.innerHTML = `${file.filename} <span class="lock-icon">🔒</span>`;
      tab.title = "Read-Only Reference File";
      tab.onclick = () => switchTab(file.filename);
      editorTabsElem.appendChild(tab);
    });
  }
}

function switchTab(filename) {
  activeTabFilename = filename;

  if (filename === "starter.py") {
    editorContainerElem.classList.remove("hidden");
    readonlyViewElem.classList.add("hidden");
    if (editor) editor.refresh();
  } else {
    const supportFile = currentTaskData.supportFiles.find(f => f.filename === filename);
    if (supportFile) {
      readonlyCodeContentElem.innerText = supportFile.content;
      editorContainerElem.classList.add("hidden");
      readonlyViewElem.classList.remove("hidden");
    }
  }

  renderEditorTabs();
}

// --- 4. LocalStorage & File Persistence ---
function resetCodeToStarter() {
  if (!currentTaskData || !editor) return;

  const confirmReset = confirm(
    "エディタの内容を初期状態に戻しますか？\n（入力中のコードは消去されます）"
  );

  if (confirmReset) {
    localStorage.removeItem(STORAGE_PREFIX + currentTaskData.meta.id);
    editor.setValue(currentTaskData.starterCode || "# ここにコードを記述してください\n");
    outputElem.innerText = `『${currentTaskData.meta.title}』のコードを初期化しました。`;
  }
}

function saveCodeToLocalStorage(taskId) {
  if (!taskId || !editor) return;
  localStorage.setItem(STORAGE_PREFIX + taskId, editor.getValue());
}

function loadCodeForTask(taskData) {
  if (!taskData || !editor) return;

  const savedCode = localStorage.getItem(STORAGE_PREFIX + taskData.meta.id);
  if (savedCode !== null) {
    editor.setValue(savedCode);
  } else {
    editor.setValue(taskData.starterCode || "# Write your solution here\n");
  }
}

function saveCodeToFile() {
  if (!editor || !currentTaskData) return;

  const code = editor.getValue();
  const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
  const filename = `${currentTaskData.meta.id || "solution"}.py`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function loadCodeFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target.result;
    if (editor) {
      editor.setValue(contents);
      if (currentTaskData) {
        saveCodeToLocalStorage(currentTaskData.meta.id);
      }
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

// --- 5. Execution Engine ---
async function executeSuite(isSubmission = false) {
  if (!pyodide || !currentTaskData) return;

  runBtn.disabled = true;
  submitBtn.disabled = true;

  outputElem.innerText = isSubmission 
    ? "採点中... 全テストケースを実行しています\n" 
    : "サンプルテストを実行中...\n";

  if (currentTaskData.supportFiles && currentTaskData.supportFiles.length > 0) {
    currentTaskData.supportFiles.forEach(file => {
      pyodide.FS.writeFile(file.filename, file.content, { encoding: 'utf8' });
    });
  }

  const userCode = editor ? editor.getValue() : "";
  let evaluateTask = null;

  try {
    const EXAMPLE_COUNT = currentTaskData.meta.exampleCount || 3;
    const testsToRun = isSubmission
      ? currentTaskData.tests
      : currentTaskData.tests.slice(0, EXAMPLE_COUNT);

    await pyodide.runPythonAsync(currentTaskData.evaluatorPy);
    evaluateTask = pyodide.globals.get("evaluate_task");

    await pyodide.runPythonAsync("if 'reset_estimator' in globals(): reset_estimator()");

    const testResultsList = [];
    let passedCount = 0;
    let totalCpuMs = 0;
    let maxPeakMb = 0;
    let stoppedEarly = false;
    let failedTestId = null;
    let latestComplexity = null;

    for (let i = 0; i < testsToRun.length; i++) {
      const test = testsToRun[i];
      const rawResult = evaluateTask(userCode, test.input, test.expectedOutput, i);
      const res = JSON.parse(rawResult);
      res.id = test.id;

      testResultsList.push(res);

      if (typeof res.peak_mb === "number") {
        maxPeakMb = Math.max(maxPeakMb, res.peak_mb);
      }

      if (res.status === "SUCCESS") {
        totalCpuMs += res.runtime_ms;
        if (res.passed) {
          passedCount++;
        }

        if (res.complexity) {
          latestComplexity = res.complexity;
        }

        if (!res.passed && isSubmission) {
          stoppedEarly = true;
          failedTestId = test.id;
          break;
        }

      } else {
        if (isSubmission) {
          stoppedEarly = true;
          failedTestId = test.id;
          break;
        }
      }
    }

    const allPassed = passedCount === testsToRun.length;

    const modeLabel = isSubmission ? "本採点 (Full Submission)" : "サンプル実行 (Example Run)";
    let outputText = `=== ${modeLabel} ===\n`;

    if (stoppedEarly) {
      outputText += `❌ 採点中断: テストケース ${failedTestId} で失敗しました。\n`;
      outputText += `パスしたケース数: ${passedCount} / ${testsToRun.length}\n`;
    } else {
      outputText += `正解数 (Passed): ${passedCount} / ${testsToRun.length} ケース\n`;
    }

    outputText += `合計 CPU 実行時間: ${totalCpuMs.toFixed(3)} ms\n`;
    outputText += `最大メモリ使用量 (Peak Memory): ${formatMemory(maxPeakMb)}\n`;

    if (isSubmission) {
      if (latestComplexity) {
        const timeComp = latestComplexity.time?.complexity || "N/A";
        const spaceComp = latestComplexity.space?.complexity || "N/A";

        outputText += `(Estimated Time Complexity): ${timeComp}\n`;
        outputText += `(Estimated Space Complexity): ${spaceComp}\n`;
      } else {
        outputText += `(Estimated Time Complexity): N/A\n`;
        outputText += `(Estimated Space Complexity): N/A\n`;
      }
    }

    outputText += `----------------------------------------\n\n`;

    testResultsList.forEach((r) => {
      if (r.status === "SUCCESS") {
        const icon = r.passed ? "✅" : "❌";
        const statusText = r.passed ? "正解 (PASSED)" : "不正解 (FAILED)";
        outputText += `${icon} テスト ${r.id}: ${statusText} (${r.runtime_ms.toFixed(3)} ms, ${formatMemory(r.peak_mb)})\n`;
        if (!r.passed) {
          outputText += `   出力結果 (Got): ${JSON.stringify(r.got)}\n`;
          outputText += `   期待する出力 (Expected): ${JSON.stringify(r.expected)}\n`;
        }
      } else {
        outputText += `💥 テスト ${r.id}: 実行エラー (${r.status}) - ${r.error}\n`;
      }
    });

    if (stoppedEarly) {
      outputText += `\n⚠️ 以降のテストケースの実行はスキップされました。`;
    }

    outputElem.innerText = outputText;

    return {
      allPassed: allPassed,
      timeComplexity: latestComplexity ? latestComplexity.time?.complexity : "N/A",
      spaceComplexity: latestComplexity ? latestComplexity.space?.complexity : "N/A",
      totalRuntimeMs: totalCpuMs,
      peakMemoryMb: maxPeakMb
    };

  } catch (err) {
    outputElem.innerText = `❌ [システムエラー]\n${err}`;
    return null;
  } finally {
    if (evaluateTask && typeof evaluateTask.destroy === "function") {
      evaluateTask.destroy();
    }
    runBtn.disabled = false;
    submitBtn.disabled = false;
  }
}

function formatMemory(peakMb) {
  if (!peakMb || peakMb <= 0) return "0 KB";
  if (peakMb < 0.1) {
    const peakKb = peakMb * 1024;
    return `${peakKb.toFixed(1)} KB`;
  }
  return `${peakMb.toFixed(2)} MB`;
}

function loadUsername() {
  const input = document.getElementById("nicknameInput");
  const storedName = localStorage.getItem("autograder_username");

  if (storedName) {
    input.value = storedName;
    input.setAttribute("readonly", "true");
    nicknameSetBtn.textContent = "編集";
    nicknameSetBtn.classList.add("is-locked");
  }
}

function lockUsername() {
  const input = document.getElementById("nicknameInput");
  const trimmedValue = input.value.trim();

  if (trimmedValue === "") return;

  if (input.hasAttribute("readonly")) {
    input.removeAttribute("readonly");
    nicknameSetBtn.textContent = "設定";
    nicknameSetBtn.classList.remove("is-locked");
    input.focus();
  } else {
    input.setAttribute("readonly", "true");
    nicknameSetBtn.textContent = "編集";
    nicknameSetBtn.classList.add("is-locked");
    localStorage.setItem("autograder_username", trimmedValue);
  }
}

async function handleSubmit() {
  let username = document.getElementById("nicknameInput").value.trim();

  if (!username) {
    const proceed = confirm(
      "ユーザー名が設定されていません。\nこのまま進むと「匿名」として記録されます。続行しますか？"
    );
    if (!proceed) return;
    username = "匿名";
  }

  const results = await executeSuite(true);

  if (!results || !results.allPassed) {
    return;
  }

  const currentTaskId = currentTaskData.meta.id;

  if (window.processLeaderboardSubmission) {
    await window.processLeaderboardSubmission(username, currentTaskId, results);
  }

  await loadAndRenderLeaderboard(currentTaskId, username);
}

// --- Leaderboard & History Modal Logic ---
async function loadAndRenderLeaderboard(taskId, username) {
  const lbContainer = document.getElementById("leaderboardContainer");
  const historyBtn = document.getElementById("viewHistoryBtn");

  if (!taskId) {
    if (lbContainer) lbContainer.classList.add("hidden");
    if (historyBtn) historyBtn.style.display = "none";
    return;
  }

  const activeUsername = (
    username || 
    document.getElementById("nicknameInput").value || 
    localStorage.getItem("autograder_username") || 
    ""
  ).trim();

  currentLeaderboardUsername = activeUsername;

  if (window.fetchTaskLeaderboard) {
    cachedLeaderboardEntries = await window.fetchTaskLeaderboard(taskId);

    const userEntry = cachedLeaderboardEntries.find(
      (entry) => entry.username.trim().toLowerCase() === activeUsername.toLowerCase()
    );

    if (userEntry) {
      if (lbContainer) lbContainer.classList.remove("hidden");
      if (historyBtn) historyBtn.style.display = "block";
      renderCondensedTable();
    } else {
      if (lbContainer) lbContainer.classList.add("hidden");
      if (historyBtn) historyBtn.style.display = "none";
    }
  }
}

function switchLeaderboardTab(tab) {
  currentLeaderboardTab = tab;

  document.getElementById("btnTabTime").classList.toggle("active", tab === "time");
  document.getElementById("btnTabMemory").classList.toggle("active", tab === "memory");

  document.getElementById("lbMetricCol").textContent = tab === "time" ? "計算量 (時間)" : "空間計算量";
  document.getElementById("lbSecondaryCol").textContent = tab === "time" ? "合計時間 (ms)" : "ピーク (MB)";

  renderCondensedTable();
}

// Make available globally for HTML inline onclick attributes
window.switchLeaderboardTab = switchLeaderboardTab;

function renderCondensedTable() {
  const tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = "";

  if (cachedLeaderboardEntries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#a0a0b0;">まだデータがありません</td></tr>`;
    return;
  }

  let validEntries = cachedLeaderboardEntries.filter(entry => {
    return currentLeaderboardTab === "time" ? entry.timeRecord : entry.memoryRecord;
  });

  validEntries.sort((a, b) => {
    if (currentLeaderboardTab === "time") {
      if (a.timeRecord.complexityRank !== b.timeRecord.complexityRank) {
        return a.timeRecord.complexityRank - b.timeRecord.complexityRank;
      }
      return a.timeRecord.totalRuntimeMs - b.timeRecord.totalRuntimeMs;
    } else {
      if (a.memoryRecord.complexityRank !== b.memoryRecord.complexityRank) {
        return a.memoryRecord.complexityRank - b.memoryRecord.complexityRank;
      }
      return a.memoryRecord.peakMemoryMb - b.memoryRecord.peakMemoryMb;
    }
  });

  validEntries.forEach((entry, index) => {
    const tr = document.createElement("tr");

    if (entry.username.trim().toLowerCase() === currentLeaderboardUsername.toLowerCase()) {
      tr.classList.add("highlight-user");
    }

    const isUser = entry.username.trim().toLowerCase() === currentLeaderboardUsername.toLowerCase() ? `<span class="you-tag">(You)</span>` : "";

    let metricBadge, secondaryText;
    if (currentLeaderboardTab === "time") {
      metricBadge = `<span class="badge">${entry.timeRecord.complexity}</span>`;
      secondaryText = `${entry.timeRecord.totalRuntimeMs.toFixed(2)} ms`;
    } else {
      metricBadge = `<span class="badge">${entry.memoryRecord.complexity}</span>`;
      secondaryText = `${entry.memoryRecord.peakMemoryMb.toFixed(2)} MB`;
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.username} ${isUser}</td>
      <td>${metricBadge}</td>
      <td>${secondaryText}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function openSubmissionHistory() {
  const container = document.getElementById("historyListContainer");
  const activeUsername = (
    document.getElementById("nicknameInput").value || 
    localStorage.getItem("autograder_username") || 
    ""
  ).trim();

  if (!container || !currentTaskData) return;
  container.innerHTML = `<p style="color: #a0a0b0; text-align: center;">読み込み中...</p>`;

  historyModal.classList.remove("hidden");

  const taskId = currentTaskData.meta ? currentTaskData.meta.id : currentTaskData.id;

  if (window.fetchUserSubmissionHistory) {
    const historyList = await window.fetchUserSubmissionHistory(taskId, activeUsername);

    if (historyList.length === 0) {
      container.innerHTML = `<p style="color: #a0a0b0; text-align: center;">提出履歴が見つかりませんでした。</p>`;
      return;
    }

    let html = "";
    historyList.forEach((attempt, index) => {
      const dateStr = attempt.timestamp 
        ? new Date(attempt.timestamp.seconds * 1000).toLocaleString("ja-JP")
        : "日時不明";

      html += `
        <div class="history-item" style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
          <div class="history-item-header">
            <span class="history-status passed">試行 #${historyList.length - index}</span>
            <span style="font-size: 0.8rem; color: #a0a0b0;">${dateStr}</span>
          </div>
          <div style="margin-top: 6px; font-size: 0.85rem; line-height: 1.5;">
            <p>⚡ 時間計算量: <span class="badge">${attempt.timeComplexity || "N/A"}</span> (${attempt.totalRuntimeMs ? attempt.totalRuntimeMs.toFixed(2) : "0"} ms)</p>
            <p>💾 空間計算量: <span class="badge">${attempt.spaceComplexity || "N/A"}</span> (${attempt.peakMemoryMb ? attempt.peakMemoryMb.toFixed(2) : "0"} MB)</p>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", initApp);
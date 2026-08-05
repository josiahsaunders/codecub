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

// Helper: Simple Markdown Parser
function parseMarkdown(md) {
  if (!md) return '';

  return md
    // Headers (#, ##, ###)
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$2</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Italics: *text* -> <em>text</em>  <-- THIS WAS MISSING!
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Inline code: `code` -> <code>code</code>
    .replace(/`(.*?)`/g, '<code>$1</code>')
    
    // Unordered lists: - item -> <li>item</li>
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    
    // Line breaks / paragraphs
    .replace(/\n\n/g, '<br><br>');
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return await res.text();
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

  // Event Listeners
  runBtn.addEventListener("click", () => executeSuite(false));
  submitBtn.addEventListener("click", () => executeSuite(true));
  resetBtn.addEventListener("click", resetCodeToStarter);
  saveBtn.addEventListener("click", saveCodeToFile);
  loadBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", loadCodeFromFile);
  filterSelect.addEventListener("change", (e) => {
    const selectedTag = e.target.value;
    renderTaskList(selectedTag);

    // Load the first available task in the filtered view
    if (problemSelect.value !== "") {
      const taskIdx = parseInt(problemSelect.value, 10);
      loadTaskFolder(tasksCatalog[taskIdx]);
    }
  });
  
  problemSelect.addEventListener("change", async (e) => {
    const selectedTask = tasksCatalog[e.target.value];
    if (selectedTask) await loadTaskFolder(selectedTask);
  });

  // Load Catalog & Pyodide concurrently
  await Promise.all([initPyodide(), loadCatalog()]);
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

// --- 2. Unpadded Parallel Test Loading (1.in ... N.in) ---
async function loadSharedPythonModules() {
  if (isSharedLoaded || !pyodide) return;

  try {
    const response = await fetch("tasks/complexity_estimator.py");
    if (!response.ok) {
      throw new Error(`Failed to load shared estimator: ${response.statusText}`);
    }

    const estimatorCode = await response.text();

    // Write to Pyodide virtual FS so standard python `import` works
    pyodide.FS.mkdirTree("/home/pyodide/shared");
    pyodide.FS.writeFile("/home/pyodide/shared/complexity_estimator.py", estimatorCode);

    // Add path to sys.path
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
        // Return null if file isn't found yet
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
    
    // Get unique list of all tags
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
    
    // Populate tag filter dropdown
    filterSelect.innerHTML = '<option value="ALL">すべてのタグ (All Tags)</option>' + tagsList.map(tag => `<option value="${tag}">${tag}</option>`).join('');

    renderTaskList("ALL");

    // Load the first available task in the filtered view
    if (problemSelect.value !== "") {
      const taskIdx = parseInt(problemSelect.value, 10);
      loadTaskFolder(tasksCatalog[taskIdx]);
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
    // Parallel fetch for task resources
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

    // Fetch unpadded test files (1.in to N.in)
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

    // Render markdown description
    descriptionElem.innerHTML = parseMarkdown(currentTaskData.descriptionMarkdown);

    // Restore saved user code or load default starter.py
    loadCodeForTask(currentTaskData);

    // Reset active tab to main starter code and render tab bar
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
  // Filter tasks based on the selected tag
  const matchingTasks = tasksCatalog.filter(task => {
    if (selectedTag === "ALL") return true;
    return task.tags && task.tags.includes(selectedTag);
  });

  // Re-populate problemSelect options storing original index or task id
  if (matchingTasks.length === 0) {
    problemSelect.innerHTML = '<option value="">該当する課題がありません</option>';
    return;
  }

  problemSelect.innerHTML = matchingTasks.map(task => {
    // Find the original index in tasksCatalog
    const originalIdx = tasksCatalog.findIndex(t => t.id === task.id);
    return `<option value="${originalIdx}">${task.title}</option>`;
  }).join('');
}

function renderEditorTabs() {
  if (!editorTabsElem || !currentTaskData) return;

  editorTabsElem.innerHTML = "";

  // Main editable tab
  const mainTab = document.createElement("button");
  mainTab.className = `editor-tab ${activeTabFilename === "starter.py" ? "active" : ""}`;
  mainTab.innerText = "starter.py";
  mainTab.onclick = () => switchTab("starter.py");
  editorTabsElem.appendChild(mainTab);

  // Support file tabs (Read-only)
  if (currentTaskData.supportFiles && currentTaskData.supportFiles.length > 0) {
    currentTaskData.supportFiles.forEach(file => {
      const tab = document.createElement("button");
      const isActive = activeTabFilename === file.filename;
      tab.className = `editor-tab ${isActive ? "active" : ""}`;
      tab.innerHTML = `${file.filename} <span class="lock-icon">🔒</span>`;
      tab.title = "Read-Only Reference File";
      tab.onclick = () => switchTab(file.filename);
      editorTabsElem.appendChild(tab);
    })
  }
}

function switchTab(filename) {
  activeTabFilename = filename;

  if (filename === "starter.py") {
    // Show CodeMirror Editor
    editorContainerElem.classList.remove("hidden");
    readonlyViewElem.classList.add("hidden");
    if (editor) editor.refresh();
  } else {
    // Find support file content
    const supportFile = currentTaskData.supportFiles.find(f => f.filename === filename);
    if (supportFile) {
      readonlyCodeContentElem.innerText = supportFile.content;
      editorContainerElem.classList.add("hidden");
      readonlyViewElem.classList.remove("hidden");
    }
  }

  // Re-render tab states
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

// --- 5. Execution Engine (Run Examples vs. Submit) ---
async function executeSuite(isSubmission = false) {
  if (!pyodide || !currentTaskData) return;

  runBtn.disabled = true;
  submitBtn.disabled = true;

  outputElem.innerText = isSubmission 
    ? "採点中... 全テストケースを実行しています\n" 
    : "サンプルテストを実行中...\n";
  
  // Sync support files to Pyodide's virtual filesystem
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

    // Clear estimator history for fresh submission run
    await pyodide.runPythonAsync("if 'reset_estimator' in globals(): reset_estimator()");

    const results = [];
    let passedCount = 0;
    let totalCpuMs = 0;
    let maxPeakMb = 0;
    let stoppedEarly = false;
    let failedTestId = null;
    let latestComplexity = "N/A";

    for (let i = 0; i < testsToRun.length; i++) {
      const test = testsToRun[i];
      const rawResult = evaluateTask(userCode, test.input, test.expectedOutput, i);
      const res = JSON.parse(rawResult);
      res.id = test.id;

      results.push(res);

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

      } else {
        if (isSubmission) {
          stoppedEarly = true;
          failedTestId = test.id;
          break;
        }
      }
    }

    // Japanese Console Output Header
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

    results.forEach((r) => {
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

  } catch (err) {
    outputElem.innerText = `❌ [システムエラー]\n${err}`;
  } finally {
    if (evaluateTask && evaluateTask.destroy === "function") {
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

document.addEventListener("DOMContentLoaded", initApp);
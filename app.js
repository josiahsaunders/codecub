// --- Application State ---
let pyodide = null;
let editor = null;
let currentTaskData = null; // Holds { meta, descriptionText, starterCode, testsCode, evaluatorPy, supportFiles, tests }
let tagsList = [];
let tasksCatalog = [];
let activeTabFilename = "starter.py"; // Can be "starter.py", "tests.py", or support filenames

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

// --- Web Worker Setup for Per-Test Timeout Management ---
let judgeWorker = null;

// Inline Worker Code
const workerCode = `
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodide = null;
let isSharedLoaded = false;

async function initWorker() {
    try {
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        postMessage({ type: "INIT_COMPLETE" });
    } catch (err) {
        postMessage({ type: "INIT_ERROR", error: String(err) });
    }
}

self.onmessage = async function(e) {
    const { action, userCode, testsCode, evaluatorPy, test, testIndex, sharedEstimatorCode, sharedBaseCode } = e.data;

    if (action === "INIT") {
        await initWorker();
        return;
    }

    if (action === "RUN_USER_TESTS") {
        try {
            let capturedLogs = [];
            pyodide.setStdout({
                batched: (text) => {
                    capturedLogs.push(text);
                }
            });

            // Ensure virtual directory exists
            if (!pyodide.FS.analyzePath("/home/pyodide").exists) {
                pyodide.FS.mkdirTree("/home/pyodide");
            }

            // Write solution and tests to virtual filesystem
            pyodide.FS.writeFile("/home/pyodide/solution.py", userCode);
            pyodide.FS.writeFile("/home/pyodide/tests.py", testsCode);

            const runnerPy = \`
import sys
import traceback
import io
import importlib

if '/home/pyodide' not in sys.path:
    sys.path.append('/home/pyodide')

# Clear module cache to pick up latest edits
if 'solution' in sys.modules:
    del sys.modules['solution']
if 'tests' in sys.modules:
    del sys.modules['tests']

results = []
try:
    import tests
    importlib.reload(tests)
    
    test_funcs = [name for name in dir(tests) if name.startswith('test_')]
    if not test_funcs:
        results.append({"name": "General", "passed": False, "error": "No test functions starting with 'test_' found in tests.py"})
    
    for name in sorted(test_funcs):
        func = getattr(tests, name)
        func_out = io.StringIO()
        sys.stdout = func_out
        try:
            func()
            results.append({"name": name, "passed": True, "output": func_out.getvalue()})
        except AssertionError as ae:
            results.append({"name": name, "passed": False, "error": str(ae) or "Assertion Failed", "output": func_out.getvalue()})
        except Exception as e:
            tb = traceback.format_exc()
            results.append({"name": name, "passed": False, "error": tb, "output": func_out.getvalue()})
except Exception as e:
    tb = traceback.format_exc()
    results.append({"name": "Compilation/Syntax", "passed": False, "error": tb})
finally:
    sys.stdout = sys.__stdout__

import json
json.dumps({"results": results})
\`;

            const rawRes = await pyodide.runPythonAsync(runnerPy);
            const res = JSON.parse(rawRes);

            postMessage({
                type: "USER_TESTS_RESULT",
                payload: {
                    results: res.results,
                    logs: capturedLogs.join("\\n")
                }
            });
        } catch (err) {
            postMessage({ type: "ERROR", error: String(err) });
        }
        return;
    }

    if (action === "RUN_SINGLE_TEST") {
        try {
            let capturedLogs = [];
            pyodide.setStdout({
                batched: (text) => {
                    capturedLogs.push(text);
                }
            });

            if (!isSharedLoaded && sharedEstimatorCode) {
                pyodide.FS.mkdirTree("/home/pyodide/shared");
                pyodide.FS.writeFile("/home/pyodide/shared/complexity_estimator.py", sharedEstimatorCode);

                if (sharedBaseCode) {
                  pyodide.FS.writeFile("/home/pyodide/shared/evaluator_base.py", sharedBaseCode);
                }

                await pyodide.runPythonAsync(
                    "import sys\\n" +
                    "if '/home/pyodide/shared' not in sys.path:\\n" +
                    "    sys.path.append('/home/pyodide/shared')"
                );
                isSharedLoaded = true;
            }

            await pyodide.runPythonAsync(evaluatorPy);
            const evaluateTask = pyodide.globals.get("evaluate_task");

            if (testIndex === 0) {
                await pyodide.runPythonAsync("if 'reset_estimator' in globals(): reset_estimator()");
            }

            const rawResult = evaluateTask(userCode, test.input, test.expectedOutput, testIndex);
            const res = JSON.parse(rawResult);

            res.logs = capturedLogs.join("\\n");

            if (evaluateTask && typeof evaluateTask.destroy === "function") {
                evaluateTask.destroy();
            }

            postMessage({
                type: "SINGLE_TEST_RESULT",
                payload: res
            });
        } catch (err) {
            postMessage({ type: "ERROR", error: String(err) });
        }
    }
};
`;

/**
 * Initializes or restarts the Web Worker
 */
function spawnJudgeWorker() {
    if (judgeWorker) {
        judgeWorker.terminate();
    }

    const blob = new Blob([workerCode], { type: "application/javascript" });
    judgeWorker = new Worker(URL.createObjectURL(blob));

    return new Promise((resolve, reject) => {
        judgeWorker.onmessage = (e) => {
            if (e.data.type === "INIT_COMPLETE") {
                console.log("✅ Pyodide Worker initialized successfully.");
                resolve();
            } else if (e.data.type === "INIT_ERROR") {
                console.error("❌ Worker Init Error:", e.data.error);
                reject(new Error(e.data.error));
            }
        };

        judgeWorker.onerror = (err) => {
            console.error("❌ Worker Script Error:", err);
            reject(err);
        };

        judgeWorker.postMessage({ action: "INIT" });
    });
}

// Helper: Full Markdown & Math Parser using Marked + KaTeX
function parseMarkdown(mdText) {
  if (!mdText) return '';

  // 1. Pre-process LaTeX equations so Marked doesn't destroy backslashes/underscores
  let processed = mdText;

  // Block math: $$ ... $$
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return `<div class="math-block">${katex.renderToString(math.trim(), { displayMode: true })}</div>`;
    } catch (e) {
      return match;
    }
  });

  // Inline math: $ ... $
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false });
    } catch (e) {
      return match;
    }
  });

  // 2. Parse Markdown (handles nested lists, bold, tables, headers, code blocks natively)
  return marked.parse(processed, {
    gfm: true,
    breaks: true
  });
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
      if (activeTabFilename === "starter.py") {
        currentTaskData.solutionCode = editor.getValue();
        localStorage.setItem(STORAGE_PREFIX + currentTaskData.meta.id + "_solution", editor.getValue());
      } else if (activeTabFilename === "tests.py") {
        currentTaskData.testsCode = editor.getValue();
        localStorage.setItem(STORAGE_PREFIX + currentTaskData.meta.id + "_tests", editor.getValue());
      }
    }
  });

  // Load username
  loadUsername();

  // Event Listeners
  runBtn.addEventListener("click", executeUserTestsScript);
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
    outputElem.innerText = "Loading Pyodide runtime in Web Worker...";

    await spawnJudgeWorker();

    if (currentTaskData) {
      runBtn.disabled = false;
      submitBtn.disabled = false;
    }

    outputElem.innerText = "Ready! Select a task to begin.";
  } catch (err) {
    outputElem.innerText = `❌ Failed to initialize Python runtime: ${err.message || err}`;
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
          if (!tagsList.includes(tag)) tagsList.push(tag);
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
    const [descText, starterText, testsText, evalText] = await Promise.all([
      fetchText(`${folderPath}/description.md`),
      fetchText(`${folderPath}/starter.py`),
      fetchText(`${folderPath}/tests.py`).catch(() => `# ここにテストを記述してください\nfrom solution import Solution\n\ndef test_example():\n    pass\n`),
      fetchText(`${folderPath}/evaluator.py`)
    ]);

    const supportPromises = taskMeta.supportFiles
      ? taskMeta.supportFiles.map(async (filename) => {
        const content = await fetchText(`${folderPath}/${filename}`);
        return { filename, content };
      })
      : [];

    const supportFiles = await Promise.all(supportPromises);
    const testCases = await loadTestCases(folderPath, taskMeta.testCount);

    const taskId = taskMeta.id;
    const savedSolution = localStorage.getItem(STORAGE_PREFIX + taskId + "_solution");
    const savedTests = localStorage.getItem(STORAGE_PREFIX + taskId + "_tests");

    currentTaskData = {
      meta: taskMeta,
      descriptionMarkdown: descText,
      solutionCode: savedSolution !== null ? savedSolution : starterText,
      testsCode: savedTests !== null ? savedTests : testsText,
      starterCode: starterText,
      defaultTestsCode: testsText,
      evaluatorPy: evalText,
      supportFiles: supportFiles,
      tests: testCases
    };

    descriptionElem.innerHTML = parseMarkdown(currentTaskData.descriptionMarkdown);
    
    activeTabFilename = "starter.py";
    editor.setValue(currentTaskData.solutionCode);
    renderEditorTabs();
    switchTab("starter.py");

    if (judgeWorker) {
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
    const difficultyLabel = task.difficulty ? `[${task.difficulty}] ` : "";
    return `<option value="${originalIdx}">${difficultyLabel}${task.title}</option>`;
  }).join('');
}

function renderEditorTabs() {
  if (!editorTabsElem || !currentTaskData) return;

  editorTabsElem.innerHTML = "";

  // 1. starter.py tab (editable solution)
  const mainTab = document.createElement("button");
  mainTab.className = `editor-tab ${activeTabFilename === "starter.py" ? "active" : ""}`;
  mainTab.innerText = "starter.py";
  mainTab.onclick = () => switchTab("starter.py");
  editorTabsElem.appendChild(mainTab);

  // 2. Read-only support files tabs (if any)
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

  // 3. tests.py tab on the FAR RIGHT (editable test script)
  const testTab = document.createElement("button");
  testTab.className = `editor-tab ${activeTabFilename === "tests.py" ? "active" : ""}`;
  testTab.innerText = "tests.py 🧪";
  testTab.title = "Your Test Script";
  testTab.onclick = () => switchTab("tests.py");
  editorTabsElem.appendChild(testTab);
}

function switchTab(filename) {
  // Save current editor contents before switching out
  if (editor && currentTaskData) {
    if (activeTabFilename === "starter.py") {
      currentTaskData.solutionCode = editor.getValue();
      localStorage.setItem(STORAGE_PREFIX + currentTaskData.meta.id + "_solution", editor.getValue());
    } else if (activeTabFilename === "tests.py") {
      currentTaskData.testsCode = editor.getValue();
      localStorage.setItem(STORAGE_PREFIX + currentTaskData.meta.id + "_tests", editor.getValue());
    }
  }

  activeTabFilename = filename;

  if (filename === "starter.py") {
    editor.setValue(currentTaskData.solutionCode);
    editorContainerElem.classList.remove("hidden");
    readonlyViewElem.classList.add("hidden");
    editor.refresh();
  } else if (filename === "tests.py") {
    editor.setValue(currentTaskData.testsCode);
    editorContainerElem.classList.remove("hidden");
    readonlyViewElem.classList.add("hidden");
    editor.refresh();
  } else {
    // Read-only support files
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

  if (activeTabFilename === "tests.py") {
    const confirmReset = confirm("テストスクリプト (tests.py) を初期状態に戻しますか？");
    if (confirmReset) {
      currentTaskData.testsCode = currentTaskData.defaultTestsCode;
      localStorage.removeItem(STORAGE_PREFIX + currentTaskData.meta.id + "_tests");
      editor.setValue(currentTaskData.testsCode);
      outputElem.innerText = "テストスクリプトを初期化しました。";
    }
    return;
  }

  const confirmReset = confirm("エディタの内容を初期状態に戻しますか？\n（入力中のコードは消去されます）");
  if (confirmReset) {
    currentTaskData.solutionCode = currentTaskData.starterCode;
    localStorage.removeItem(STORAGE_PREFIX + currentTaskData.meta.id + "_solution");
    editor.setValue(currentTaskData.solutionCode);
    outputElem.innerText = `『${currentTaskData.meta.title}』のコードを初期化しました。`;
  }
}

function saveCodeToFile() {
  if (!editor || !currentTaskData) return;

  const code = editor.getValue();
  const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
  const filename = activeTabFilename === "tests.py" ? "tests.py" : `${currentTaskData.meta.id || "solution"}.py`;

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
        if (activeTabFilename === "tests.py") {
          currentTaskData.testsCode = contents;
          localStorage.setItem(STORAGE_PREFIX + currentTaskData.meta.id + "_tests", contents);
        } else {
          currentTaskData.solutionCode = contents;
          localStorage.setItem(STORAGE_PREFIX + currentTaskData.meta.id + "_solution", contents);
        }
      }
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

// --- 5. Execution Engine (Sample Run & Submit) ---

async function executeUserTestsScript() {
  if (!judgeWorker || !currentTaskData) return;

  runBtn.disabled = true;
  submitBtn.disabled = true;
  outputElem.innerText = "テストを実行中...\n";

  // Ensure current active tab code is synchronized
  if (activeTabFilename === "starter.py") {
    currentTaskData.solutionCode = editor.getValue();
  } else if (activeTabFilename === "tests.py") {
    currentTaskData.testsCode = editor.getValue();
  }

  const userCode = currentTaskData.solutionCode;
  const testsCode = currentTaskData.testsCode;

  const runTestScriptWorker = () => new Promise((resolve) => {
    let isHandled = false;
    const timeoutId = setTimeout(async () => {
      if (isHandled) return;
      isHandled = true;
      await spawnJudgeWorker();
      resolve({ status: "TLE", error: "実行時間制限超過 (> 30秒)" });
    }, 30000);

    judgeWorker.onmessage = (e) => {
      if (isHandled) return;
      if (e.data.type === "USER_TESTS_RESULT") {
        clearTimeout(timeoutId);
        isHandled = true;
        resolve({ status: "SUCCESS", payload: e.data.payload });
      } else if (e.data.type === "ERROR") {
        clearTimeout(timeoutId);
        isHandled = true;
        resolve({ status: "ERROR", error: e.data.error });
      }
    };

    judgeWorker.postMessage({
      action: "RUN_USER_TESTS",
      userCode,
      testsCode
    });
  });

  const res = await runTestScriptWorker();

  let outputText = `=== サンプル実行 (tests.py) ===\n`;

  if (res.status === "SUCCESS") {
    const data = res.payload;
    const results = data.results || [];
    
    if (data.logs && data.logs.trim().length > 0) {
      outputText += `標準出力 (stdout):\n${data.logs}\n----------------------------------------\n`;
    }

    let passedCount = results.filter(r => r.passed).length;
    let totalCount = results.length;

    outputText += `結果: ${passedCount} / ${totalCount} テスト合格\n\n`;

    results.forEach(r => {
      const icon = r.passed ? "✅" : "❌";
      outputText += `${icon} ${r.name}: ${r.passed ? "PASS" : "FAIL"}\n`;
      if (r.output && r.output.trim()) {
        outputText += `   出力:\n   ${r.output.trim().replace(/\n/g, "\n   ")}\n`;
      }
      if (!r.passed && r.error) {
        outputText += `   エラー / 詳細:\n   ${r.error.trim().replace(/\n/g, "\n   ")}\n`;
      }
    });
  } else {
    outputText += `💥 実行エラー: ${res.error}\n`;
  }

  outputElem.innerText = outputText;
  runBtn.disabled = false;
  submitBtn.disabled = false;
}

async function executeSuite(isSubmission = false) {
  if (!judgeWorker || !currentTaskData) return null;

  runBtn.disabled = true;
  submitBtn.disabled = true;

  outputElem.innerText = "採点中... 全テストケースを実行しています\n";

  if (activeTabFilename === "starter.py") {
    currentTaskData.solutionCode = editor.getValue();
  }
  const userCode = currentTaskData.solutionCode;
  const testsToRun = currentTaskData.tests;

  let sharedEstimatorCode = "";
  let sharedBaseCode = "";
  try {
    const [estimatorRes, baseRes] = await Promise.all([
      fetch("tasks/complexity_estimator.py"),
      fetch("tasks/evaluator_base.py")
    ]);
    if (estimatorRes.ok) sharedEstimatorCode = await estimatorRes.text();
    if (baseRes.ok) sharedBaseCode = await baseRes.text();
  } catch (e) {}

  const PER_TEST_TIMEOUT_MS = 120000; // 120-second limit per individual test case
  const testResultsList = [];
  let passedCount = 0;
  let totalCpuMs = 0;
  let maxPeakMb = 0;
  let stoppedEarly = false;
  let failedTestId = null;
  let latestComplexity = null;

  for (let i = 0; i < testsToRun.length; i++) {
    const test = testsToRun[i];

    // Run a single test case wrapped in a per-test hard timeout
    const runSingleTest = () => new Promise((resolve) => {
      let isHandled = false;

      const timeoutId = setTimeout(async () => {
        if (isHandled) return;
        isHandled = true;

        // Respawn frozen worker for subsequent test runs
        await spawnJudgeWorker();
        resolve({ status: "TLE", error: `タイムアウト`, id: test.id });
      }, PER_TEST_TIMEOUT_MS);

      judgeWorker.onmessage = (e) => {
        if (isHandled) return;

        if (e.data.type === "SINGLE_TEST_RESULT") {
          clearTimeout(timeoutId);
          isHandled = true;
          resolve(e.data.payload);
        } else if (e.data.type === "ERROR") {
          clearTimeout(timeoutId);
          isHandled = true;
          resolve({ status: "ERROR", error: e.data.error, id: test.id });
        }
      };

      judgeWorker.postMessage({
        action: "RUN_SINGLE_TEST",
        userCode,
        evaluatorPy: currentTaskData.evaluatorPy,
        test,
        testIndex: i,
        sharedEstimatorCode,
        sharedBaseCode
      });
    });

    const res = await runSingleTest();
    res.id = test.id;
    testResultsList.push(res);

    if (typeof res.peak_mb === "number") {
      maxPeakMb = Math.max(maxPeakMb, res.peak_mb);
    }

    if (res.status === "SUCCESS") {
      totalCpuMs += res.runtime_ms;
      if (res.passed) passedCount++;
      if (res.complexity) latestComplexity = res.complexity;

      // On Submission: halt execution immediately on first failed test case
      if (!res.passed) {
        stoppedEarly = true;
        failedTestId = test.id;
        break;
      }
    } else {
      // Handles TLE or Runtime Error: stop remaining tests
      stoppedEarly = true;
      failedTestId = test.id;
      break;
    }
  }

  // --- Render Results Output ---
  let outputText = `=== 本採点 (Full Submission) ===\n`;

  if (stoppedEarly) {
    outputText += `❌ 採点中断: テストケース ${failedTestId} で停止しました。\n`;
    outputText += `パスしたケース数: ${passedCount} / ${testsToRun.length}\n`;
  } else {
    outputText += `正解数 (Passed): ${passedCount} / ${testsToRun.length} ケース\n`;
  }

  outputText += `合計 CPU 実行時間: ${totalCpuMs.toFixed(3)} ms\n`;
  outputText += `最大メモリ使用量: ${formatMemory(maxPeakMb)}\n`;

  const timeComp = latestComplexity ? (latestComplexity.time?.complexity || "N/A") : "N/A";
  const spaceComp = latestComplexity ? (latestComplexity.space?.complexity || "N/A") : "N/A";
  outputText += `推定時間計算量: ${timeComp}\n`;
  outputText += `推定空間計算量: ${spaceComp}\n`;
  outputText += `----------------------------------------\n\n`;

  testResultsList.forEach((r) => {
    const icon = r.passed ? "✅" : "❌";
    const statusText = r.passed ? "正解 (PASSED)" : "不正解 (FAILED)";
    outputText += `${icon} テスト ${r.id}: ${statusText} (${r.runtime_ms.toFixed(3)} ms, ${formatMemory(r.peak_mb)})\n`;
  });

  outputElem.innerText = outputText;

  runBtn.disabled = false;
  submitBtn.disabled = false;

  return {
    allPassed: passedCount === testsToRun.length,
    timeComplexity: timeComp,
    spaceComplexity: spaceComp,
    totalRuntimeMs: totalCpuMs,
    peakMemoryMb: maxPeakMb
  };
}

function formatMemory(peakMb) {
  if (!peakMb || peakMb <= 0) return "0 KB";
  if (peakMb < 0.1) {
    return `${(peakMb * 1024).toFixed(1)} KB`;
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

async function lockUsername() {
  const input = document.getElementById("nicknameInput");
  const trimmedValue = input.value.trim();

  // Helper to safely retrieve current task ID
  const getCurrentTaskId = () => {
    if (currentTaskData && currentTaskData.meta) return currentTaskData.meta.id;
    if (problemSelect && problemSelect.value !== "") {
      const taskIdx = parseInt(problemSelect.value, 10);
      if (tasksCatalog[taskIdx]) {
        return tasksCatalog[taskIdx].meta ? tasksCatalog[taskIdx].meta.id : tasksCatalog[taskIdx].id;
      }
    }
    return null;
  };

  const taskId = getCurrentTaskId();

  if (input.hasAttribute("readonly")) {
    // --- UNLOCKING FOR EDITING ---
    input.removeAttribute("readonly");
    nicknameSetBtn.textContent = "設定";
    nicknameSetBtn.classList.remove("is-locked");
    input.focus();

    // Re-render leaderboard for empty/in-progress name (will hide if no match)
    if (taskId) await loadAndRenderLeaderboard(taskId, "");
  } else {
    // --- LOCKING NEW NICKNAME ---
    if (trimmedValue === "") return;

    input.setAttribute("readonly", "true");
    nicknameSetBtn.textContent = "編集";
    nicknameSetBtn.classList.add("is-locked");
    localStorage.setItem("autograder_username", trimmedValue);

    // Re-check Firebase and reveal Leaderboard/History if records exist for this new nickname
    if (taskId) await loadAndRenderLeaderboard(taskId, trimmedValue);
  }
}

async function handleSubmit() {
  let username = document.getElementById("nicknameInput").value.trim();

  if (!username) {
    const proceed = confirm("ユーザー名が設定されていません。\nこのまま進むと「匿名」として記録されます。続行しますか？");
    if (!proceed) return;
    username = "匿名";
  }

  const results = await executeSuite(true);

  if (!results || !results.allPassed) return;

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
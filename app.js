// --- Application State ---
let pyodide = null;
let editor = null;
let currentTaskData = null; // Holds { meta, descriptionText, starterCode, evaluatorPy, tests }
let tasksCatalog = [];

const STORAGE_PREFIX = "judge_code_task_";

// --- DOM Elements ---
const problemSelect = document.getElementById("taskSelect");
const descriptionElem = document.getElementById("taskDescription");
const outputElem = document.getElementById("outputConsole");
const runBtn = document.getElementById("runBtn");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const fileInput = document.getElementById("fileInput");

// Helper: Simple Markdown Parser
function parseMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$2</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
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
    outputElem.innerText = "Ready! Select a task to begin.";
  } catch (err) {
    outputElem.innerText = `❌ Failed to initialize Python runtime: ${err}`;
  }
}

// --- 2. Unpadded Parallel Test Loading (1.in ... N.in) ---
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
    problemSelect.innerHTML = tasksCatalog.map((task, idx) => 
      `<option value="${idx}">${task.title}</option>`
    ).join('');

    if (tasksCatalog.length > 0) {
      await loadTaskFolder(tasksCatalog[0]);
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

    // Fetch unpadded test files (1.in to N.in)
    const count = taskMeta.test_case_count || taskMeta.testCount || 10;
    const testCases = await loadTestCases(folderPath, count);

    currentTaskData = {
      meta: taskMeta,
      descriptionMarkdown: descText,
      starterCode: starterText,
      evaluatorPy: evalText,
      tests: testCases
    };

    // Render markdown description
    descriptionElem.innerHTML = parseMarkdown(currentTaskData.descriptionMarkdown);

    // Restore saved user code or load default starter.py
    loadCodeForTask(currentTaskData);

    if (pyodide) {
      runBtn.disabled = false;
      submitBtn.disabled = false;
    }

    outputElem.innerText = `Task '${taskMeta.title}' loaded (${testCases.length} test case(s) found). Ready.`;
  } catch (err) {
    outputElem.innerText = `❌ [Error loading task folder]\n${err.message}`;
  }
}

// --- 4. LocalStorage & File Persistence ---
function resetCodeToStarter() {
  if (!currentTaskData || !editor) return;

  const confirmReset = confirm(
    "Are you sure you want to reset your editor? All unsaved changes for this task will be lost."
  );

  if (confirmReset) {
    // Remove task draft from localStorage
    localStorage.removeItem(STORAGE_PREFIX + currentTaskData.meta.id);

    // Re-populate editor with starter code
    editor.setValue(currentTaskData.starterCode || "# Write your solution here\n");
    
    outputElem.innerText = `Reset editor to default starter code for '${currentTaskData.meta.title}'.`;
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
    ? "Submitting & running full test suite...\n" 
    : "Running example test cases...\n";

  const userCode = editor ? editor.getValue() : "";

  try {
    // Examples run first 3 tests (or exampleCount from tasks.json), Submit runs all
    const EXAMPLE_COUNT = currentTaskData.meta.exampleCount || 3;
    const testsToRun = isSubmission
      ? currentTaskData.tests
      : currentTaskData.tests.slice(0, EXAMPLE_COUNT);

    // Load task's evaluator.py into Pyodide scope
    await pyodide.runPythonAsync(currentTaskData.evaluatorPy);
    const evaluateTask = pyodide.globals.get("evaluate_task");

    const results = [];
    let passedCount = 0;
    let totalCpuMs = 0; // Summed CPU time from time.process_time()

    for (const test of testsToRun) {
      // Evaluate test via evaluate_task(user_code_str, in_text, out_text)
      const rawResult = evaluateTask(userCode, test.input, test.expectedOutput);
      const res = JSON.parse(rawResult);
      res.id = test.id;

      results.push(res);

      if (res.status === "SUCCESS") {
        totalCpuMs += res.runtime_ms;
        if (res.passed) passedCount++;
      }
    }

    // Output formatting
    const modeLabel = isSubmission ? "Full Submission" : "Example Run";
    let outputText = `=== ${modeLabel} ===\n`;
    outputText += `Passed: ${passedCount} / ${testsToRun.length} tests\n`;
    outputText += `Total CPU Time: ${totalCpuMs.toFixed(3)} ms\n`;
    outputText += `----------------------------------------\n\n`;

    results.forEach((r) => {
      if (r.status === "SUCCESS") {
        const icon = r.passed ? "✅" : "❌";
        outputText += `${icon} Test ${r.id}: ${r.passed ? "PASSED" : "FAILED"} (${r.runtime_ms.toFixed(3)} ms)\n`;
        if (!r.passed) {
          outputText += `   Got: ${JSON.stringify(r.got)} | Expected: ${JSON.stringify(r.expected)}\n`;
        }
      } else {
        outputText += `💥 Test ${r.id}: ${r.status} - ${r.error}\n`;
      }
    });

    outputElem.innerText = outputText;

  } catch (err) {
    outputElem.innerText = `❌ [Execution Error]\n${err}`;
  } finally {
    runBtn.disabled = false;
    submitBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", initApp);
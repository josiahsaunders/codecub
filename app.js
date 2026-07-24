let pyodide = null;
let editor = null;
let tasksCatalog = [];
let currentTaskData = null;

const statusElem = document.getElementById('status');
const problemSelect = document.getElementById('problem-select');
const descriptionElem = document.getElementById('description');
const difficultyElem = document.getElementById('difficulty');
const runBtn = document.getElementById('run-btn');
const outputElem = document.getElementById('output');

// Simple Markdown Parser (Zero external dependencies)
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

// 1. Fetch Catalog
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
    statusElem.innerText = "Error loading catalog.";
    outputElem.innerText = err.message;
  }
}

// 2. Load Task Folder
async function loadTaskFolder(taskMeta) {
  outputElem.innerText = "Loading task resources...";
  difficultyElem.innerText = taskMeta.difficulty;

  const folderPath = `tasks/${taskMeta.id}`;

  try {
    const descText = await fetchText(`${folderPath}/description.md`);
    const starterText = await fetchText(`${folderPath}/starter.py`);
    const evalText = await fetchText(`${folderPath}/evaluator.py`);

    currentTaskData = {
      meta: taskMeta,
      descriptionMarkdown: descText,
      starterCode: starterText,
      evaluatorPy: evalText
    };

    // Render markdown with local parser
    descriptionElem.innerHTML = parseMarkdown(currentTaskData.descriptionMarkdown);

    if (editor) {
      editor.setValue(currentTaskData.starterCode);
    }
    
    outputElem.innerText = "Task loaded successfully. Ready to run tests.";
  } catch (err) {
    outputElem.innerText = `[Error loading task]\n${err.message}`;
  }
}

// 3. Initialize Editor (Standard Setup)
function initEditor() {
  editor = ace.edit("editor-container");
  editor.setTheme("ace/theme/tomorrow_night");
  editor.session.setMode("ace/mode/python");
  editor.setFontSize(14);
  
  if (currentTaskData) {
    editor.setValue(currentTaskData.starterCode, -1);
  }
  checkReady();
}

// 4. Initialize Pyodide
async function initPyodide() {
  try {
    pyodide = await loadPyodide();
    checkReady();
  } catch (err) {
    statusElem.innerText = "Pyodide failed to load.";
  }
}

let readyCount = 0;
function checkReady() {
  readyCount++;
  if (readyCount === 2) {
    statusElem.innerText = "System Ready";
    statusElem.style.color = "#a6e3a1";
    runBtn.disabled = false;
  }
}

// Event Listeners
problemSelect.addEventListener('change', async (e) => {
  await loadTaskFolder(tasksCatalog[e.target.value]);
});

// Run Application
loadCatalog();
initEditor();
initPyodide();
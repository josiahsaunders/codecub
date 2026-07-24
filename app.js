let pyodide = null;
let editor = null; // Holds the Monaco Editor instance

const statusElem = document.getElementById('status');
const runBtn = document.getElementById('run-btn');
const outputElem = document.getElementById('output');

// Starter LeetCode-style code
const starterCode = `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
`;

// 1. Initialize Monaco Editor
function initMonaco() {
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
  
  require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: starterCode,
      language: 'python',
      theme: 'vs-dark', // Dark mode editor like VS Code
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false } // Hides the mini-map on the right to keep it clean
    });
    
    checkReady();
  });
}

// 2. Initialize Pyodide
async function initPyodide() {
  pyodide = await loadPyodide();
  checkReady();
}

// Enable button when both Monaco AND Pyodide are loaded
let readyCount = 0;
function checkReady() {
  readyCount++;
  if (readyCount === 2) {
    statusElem.innerText = "Status: Ready! Monaco Editor and Pyodide loaded.";
    statusElem.style.color = "green";
    runBtn.disabled = false;
  }
}

// 3. Evaluate LeetCode-style Submission
async function runPythonCode() {
  outputElem.innerText = "Running test cases...\n";
  const userCode = editor.getValue(); // Get text from Monaco

  try {
    // A. Load the user's Solution class into Pyodide's memory
    await pyodide.runPythonAsync(userCode);

    // B. Test Case Data (e.g., Target sum problem)
    const testCases = [
      { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
      { nums: [3, 2, 4], target: 6, expected: [1, 2] },
      { nums: [3, 3], target: 6, expected: [0, 1] }
    ];

    // C. Instantiate the user's Solution class in Python
    await pyodide.runPythonAsync(`sol = Solution()`);

    // D. Run each test case through their class method
    let passedCount = 0;
    const startTime = performance.now();

    testCases.forEach((tc, index) => {
      // Pass arguments into Python method sol.twoSum()
      const pyResult = pyodide.runPython(`sol.twoSum(${JSON.stringify(tc.nums)}, ${tc.target})`);
      const jsResult = pyResult.toJs(); // Convert Python list to JS Array

      // Simple array equality check
      const isCorrect = JSON.stringify(jsResult) === JSON.stringify(tc.expected);

      if (isCorrect) {
        passedCount++;
        outputElem.innerText += `✅ Test ${index + 1}: Passed! (Input: ${tc.target} -> Output: [${jsResult}])\n`;
      } else {
        outputElem.innerText += `❌ Test ${index + 1}: Failed. Expected [${tc.expected}], got [${jsResult}]\n`;
      }
    });

    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(4);
    
    outputElem.innerText += `\nResults: ${passedCount}/${testCases.length} Passed in ${duration}s`;

  } catch (err) {
    outputElem.innerText += `\n[Execution Error]\n${err}`;
  }
}

runBtn.addEventListener('click', runPythonCode);

// Start initialization
initMonaco();
initPyodide();
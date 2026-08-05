import json
import time
import gc
import tracemalloc
from complexity_estimator import ComplexityEstimator

# Module-level instance persists across test calls in Pyodide memory space
if 'GLOBAL_ESTIMATOR' not in globals():
    GLOBAL_ESTIMATOR = ComplexityEstimator()

def reset_estimator():
    """Call at the start of a new suite run to clear prior points."""
    global GLOBAL_ESTIMATOR
    GLOBAL_ESTIMATOR = ComplexityEstimator()

def evaluate_task(user_code_str, in_text, out_text):
    # 1. Safely load the student's class definition
    exec_scope = {}
    try:
        exec(user_code_str, exec_scope)
        sol = exec_scope['Solution']()
    except Exception as e:
        return json.dumps({"status": "COMPILE_ERROR", "error": str(e)})

    try:
        gc.collect()
        tracemalloc.start()

        # 2. Parse stdin text into Python data types
        lines = [line.strip() for line in in_text.strip().split('\n') if line.strip()]
        
        # Line 1: Array of numbers -> [2, 7, 11, 15]
        nums = list(map(int, lines[0].split()))
        # Line 2: Target integer -> 9
        target = int(lines[1])

        # Derive N dynamically from input size
        n = len(nums)

        # 3. Parse stdout/expected output
        expected = list(map(int, out_text.strip().split()))

        # 4. Measure execution of the student's method
        start_time = time.perf_counter()
        actual = sol.twoSum(nums, target)
        end_time = time.perf_counter()
        _, peak_bytes = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # Convert values
        runtime_ms = (end_time - start_time) * 1000
        peak_mb = peak_bytes / (1024 * 1024)

        # Record (N, runtime_ms) in shared estimator
        GLOBAL_ESTIMATOR.add_measurement(n, runtime_ms, peak_mb)
        complexity_info = GLOBAL_ESTIMATOR.estimate()

        # 5. Flexible validation (e.g. order-insensitive for indices)
        passed = sorted(actual) == sorted(expected)

        return json.dumps({
            "status": "SUCCESS",
            "passed": passed,
            "runtime_ms": round(runtime_ms, 3),
            "peak_mb": round(peak_mb, 4),
            "complexity": complexity_info,
            "got": actual,
            "expected": expected
        })

    except Exception as e:
        return json.dumps({"status": "RUNTIME_ERROR", "error": str(e)})
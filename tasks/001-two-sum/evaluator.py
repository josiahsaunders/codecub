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

def evaluate_task(user_code_str, in_text, out_text, test_index):
    # Safely load the student's class definition
    exec_scope = {}
    try:
        exec(user_code_str, exec_scope)
        sol = exec_scope['Solution']()
    except Exception as e:
        return json.dumps({"status": "COMPILE_ERROR", "error": str(e)})

    try:
        # Clean garbage before measurement
        gc.collect()
        tracemalloc.start()

        # Parse stdin text into Python data types
        lines = [line.strip() for line in in_text.strip().split('\n') if line.strip()]
        
        # Line 1: Array of numbers -> [2, 7, 11, 15]
        nums = list(map(int, lines[0].split()))
        # Line 2: Target integer -> 9
        target = int(lines[1])
        expected = list(map(int, out_text.strip().split()))

        # Derive N dynamically from input size
        n = len(nums)

        # Measure execution (Repeat fast runs to overcome WASM clock quantization)
        iterations = 5 if n < 500 else 1
        actual = None

        start_time = time.perf_counter()

        # Measure execution of the student's method
        
        for _ in range(iterations):
            actual = sol.twoSum(nums, target)

        end_time = time.perf_counter()
        _, peak_bytes = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # Convert values
        runtime_ms = ((end_time - start_time) * 1000) / iterations
        peak_mb = peak_bytes / (1024 * 1024)

        # Record (N, runtime_ms) in shared estimator for tests 4 to 7 (designated complexity benchmarks)
        is_complexity_test = (3 <= test_index <= 6)

        if is_complexity_test:
            GLOBAL_ESTIMATOR.add_measurement(n, runtime_ms, peak_mb)

        complexity_info = GLOBAL_ESTIMATOR.estimate()

        # 5. Flexible validation (e.g. order-insensitive for indices)
        passed = (actual is not None) and (sorted(actual) == sorted(expected))

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
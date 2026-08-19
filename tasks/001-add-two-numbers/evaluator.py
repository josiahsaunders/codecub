import json
import time
import gc
import tracemalloc

def evaluate_task(user_code_str, in_text, out_text, test_index):
    # 1. Safely load the student's class definition
    exec_scope = {}
    try:
        exec(user_code_str, exec_scope)
        if 'Solution' not in exec_scope:
            return json.dumps({"status": "COMPILE_ERROR", "error": "Class 'Solution' not found."})
        sol = exec_scope['Solution']()
    except Exception as e:
        return json.dumps({"status": "COMPILE_ERROR", "error": str(e)})

    if not hasattr(sol, "add_two_numbers"):
        return json.dumps({"status": "COMPILE_ERROR", "error": "Method 'add_two_numbers' not found on Solution class."})

    try:
        # Clean garbage before measurement
        gc.collect()
        tracemalloc.start()

        # Parse stdin text into Python data types
        # Line 1: Integer 'a'
        # Line 2: Integer 'b'
        lines = [line.strip() for line in in_text.strip().split('\n') if line.strip()]
        a = int(lines[0])
        b = int(lines[1])
        expected = int(out_text.strip())

        # For simple math tasks, N can represent total magnitude/bit length or just 1
        n = max(abs(a), abs(b)) or 1

        # Measure execution (Repeat fast runs to overcome WASM clock quantization)
        iterations = 10 if n < 1000 else 1
        actual = None

        start_time = time.perf_counter()

        # Measure execution of the student's method
        for _ in range(iterations):
            actual = sol.add_two_numbers(a, b)

        end_time = time.perf_counter()
        _, peak_bytes = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # Convert values
        runtime_ms = ((end_time - start_time) * 1000) / iterations
        peak_mb = peak_bytes / (1024 * 1024)

        complexity_info = {
            "time": {"complexity": "O(1)"},
            "space": {"complexity": "O(1)"}
        }

        # Correctness check
        passed = (actual == expected)

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
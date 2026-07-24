import json
import time
import io
import sys

def evaluate_task(user_code_str, in_text, out_text):
    # 1. Safely load the student's class definition
    exec_scope = {}
    try:
        exec(user_code_str, exec_scope)
        sol = exec_scope['Solution']()
    except Exception as e:
        return json.dumps({"status": "COMPILE_ERROR", "error": str(e)})

    try:
        # 2. Parse stdin text into Python data types
        lines = [line.strip() for line in in_text.strip().split('\n') if line.strip()]
        
        # Line 1: Array of numbers -> [2, 7, 11, 15]
        nums = list(map(int, lines[0].split()))
        # Line 2: Target integer -> 9
        target = int(lines[1])

        # 3. Parse stdout/expected output
        expected = list(map(int, out_text.strip().split()))

        # 4. Measure execution of the student's method
        start_time = time.perf_counter()
        actual = sol.twoSum(nums, target)
        end_time = time.perf_counter()

        # 5. Flexible validation (e.g. order-insensitive for indices)
        passed = sorted(actual) == sorted(expected)

        return json.dumps({
            "status": "SUCCESS",
            "passed": passed,
            "runtime_ms": round((end_time - start_time) * 1000, 3),
            "got": actual,
            "expected": expected
        })

    except Exception as e:
        return json.dumps({"status": "RUNTIME_ERROR", "error": str(e)})
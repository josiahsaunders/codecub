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
        # 2. Parse stdin/input
        # Line 1: Text -> "Test 1"
        test_text = in_text.strip()

        # 3. Parse stdout/expected output
        expected = out_text.strip()

        # 4. Measure execution of the student's method
        start_time = time.perf_counter()
        actual = sol.test(test_text)
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
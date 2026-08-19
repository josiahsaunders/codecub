import json
import time
import gc
import tracemalloc
from complexity_estimator import ComplexityEstimator

def run_evaluator(user_code_str, in_text, out_text, test_index, method_name, runner_fn, static_complexity=None, ast_checker=None):
    # 1. AST Checks (if task provides one)
    if ast_checker:
        try:
            ast_checker(user_code_str)
        except ValueError as ve:
            return json.dumps({"status": "COMPILE_ERROR", "error": f"制限違反: {str(ve)}"})
        except Exception as e:
            return json.dumps({"status": "COMPILE_ERROR", "error": f"Syntax Error: {str(e)}"})

    # 2. Exec Scope
    exec_scope = {}
    try:
        exec(user_code_str, exec_scope)
        if 'Solution' not in exec_scope:
            return json.dumps({"status": "COMPILE_ERROR", "error": "Class 'Solution' not found."})
        sol = exec_scope['Solution']()
    except Exception as e:
        return json.dumps({"status": "COMPILE_ERROR", "error": str(e)})

    if not hasattr(sol, method_name):
        return json.dumps({"status": "COMPILE_ERROR", "error": f"Method '{method_name}' not found on Solution class."})

    target_method = getattr(sol, method_name)

    # 3. Execution & Timing
    try:
        gc.collect()
        tracemalloc.start()

        # Delegate parsing & execution to task runner
        passed, actual, expected, n, iterations = runner_fn(target_method, in_text, out_text)

        start_time = time.perf_counter()
        for _ in range(iterations):
            actual = runner_fn(target_method, in_text, out_text)[1]
        end_time = time.perf_counter()

        _, peak_bytes = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        runtime_ms = ((end_time - start_time) * 1000) / iterations
        peak_mb = peak_bytes / (1024 * 1024)

        # 4. Complexity Handling
        if static_complexity:
            complexity_info = static_complexity
        else:
            if 'GLOBAL_ESTIMATOR' not in globals():
                globals()['GLOBAL_ESTIMATOR'] = ComplexityEstimator()

            if 3 <= test_index <= 6:
                globals()['GLOBAL_ESTIMATOR'].add_measurement(n, runtime_ms, peak_mb)
            
            complexity_info = globals()['GLOBAL_ESTIMATOR'].estimate()

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
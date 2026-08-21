import json
import time
import gc
import tracemalloc
from complexity_estimator import ComplexityEstimator

def reset_estimator():
    if 'GLOBAL_ESTIMATOR' in globals():
        globals()['GLOBAL_ESTIMATOR'].reset()
    else:
        globals()['GLOBAL_ESTIMATOR'] = ComplexityEstimator()

def run_evaluator(user_code_str, in_text, out_text, test_index, method_name, parse_fn, runner_fn, static_complexity=None, ast_checker=None):
    # Reset state on first test case
    if test_index == 0:
        reset_estimator()

    # 1. AST Checks
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
        input_args, expected = parse_fn(in_text, out_text)
        passed, actual, expected, n, iterations = runner_fn(target_method, input_args, expected)

        # Memory profiling
        gc.collect()
        tracemalloc.start()

        target_method(*input_args)

        _, peak_bytes = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        # Timing pass
        start_time = time.perf_counter()
        for _ in range(iterations):
            target_method(*input_args)
        end_time = time.perf_counter()

        runtime_ms = ((end_time - start_time) * 1000) / iterations
        peak_mb = peak_bytes / (1024 * 1024)

        # 4. Complexity Estimator
        if static_complexity:
            complexity_info = static_complexity
        else:
            estimator = globals()['GLOBAL_ESTIMATOR']

            if 3 <= test_index <= 6:
                estimator.add_measurement(n, runtime_ms, peak_mb)
            
            complexity_info = estimator.estimate()

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
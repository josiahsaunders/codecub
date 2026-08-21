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
    if test_index == 0:
        reset_estimator()

    # 1. AST Checks & Scope
    if ast_checker:
        try:
            ast_checker(user_code_str)
        except Exception as e:
            return json.dumps({"status": "COMPILE_ERROR", "error": str(e)})

    exec_scope = {}
    try:
        exec(user_code_str, exec_scope)
        sol = exec_scope['Solution']()
        target_method = getattr(sol, method_name)
    except Exception as e:
        return json.dumps({"status": "COMPILE_ERROR", "error": str(e)})

    try:
        input_args, expected = parse_fn(in_text, out_text)
        passed, actual, expected, n = runner_fn(target_method, input_args, expected)

        # 2. Combined Single-Pass Memory & Initial Timing
        gc.collect()
        tracemalloc.start()
        
        t0 = time.perf_counter()
        target_method(*input_args)
        t1 = time.perf_counter()
        
        _, peak_bytes = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        single_run_ms = (t1 - t0) * 1000.0
        peak_mb = peak_bytes / (1024 * 1024)

        # 3. High-Precision Timing for Sub-Millisecond Runs
        # If execution takes > 1.0ms (e.g., O(N^2) or heavy work), use single pass directly.
        if single_run_ms >= 1.0:
            runtime_ms = single_run_ms
        else:
            # For ultrafast functions (Array Sum O(N)), scale iterations up to 2000
            # to accumulate ~50ms of execution, beating browser clock jitter.
            iterations = max(1, min(int(50.0 / max(single_run_ms, 0.0005)), 2000))
            
            t_start = time.perf_counter()
            for _ in range(iterations):
                target_method(*input_args)
            t_end = time.perf_counter()
            
            runtime_ms = ((t_end - t_start) * 1000.0) / iterations

        # 4. Global Estimator
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
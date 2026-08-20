from evaluator_base import run_evaluator

def runner(method, in_text, out_text):
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    nums = [int(x) for x in lines]

    expected = int(out_text.strip())

    actual = method(nums)
    passed = (actual == expected)
    
    n = len(nums)
    iterations = iterations = 10 if n < 100 else (5 if n < 1000 else 1)
    return passed, actual, expected, n, iterations

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="array_sum",
        runner_fn=runner,
    )
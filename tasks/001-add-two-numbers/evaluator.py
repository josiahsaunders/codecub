from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(1)"},
    "space": {"complexity": "O(1)"}
}

def runner(method, in_text, out_text):
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    a, b = int(lines[0]), int(lines[1])
    expected = int(out_text.strip())

    actual = method(a, b)
    passed = (actual == expected)
    
    n = 1
    iterations = 10
    return passed, actual, expected, n, iterations

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="add_two_numbers",
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
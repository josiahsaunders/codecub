from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(1)"},
    "space": {"complexity": "O(1)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (1 number per line)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    a, b = int(lines[0]), int(lines[1])

    # Parse output
    expected = int(out_text.strip())

    return (a, b), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    passed = (actual == expected)
    
    n = 1
    iterations = 10
    return passed, actual, expected, n, iterations

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="add_two_numbers",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
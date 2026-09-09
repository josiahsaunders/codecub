from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(1)"},
    "space": {"complexity": "O(1)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input: line 1 = temp (float), line 2 = unit (str)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    temp = float(lines[0])
    unit = lines[1]

    # Parse expected output (float)
    expected = float(out_text.strip())

    return (temp, unit), expected

def runner(method, input_args: tuple, expected: float):
    actual = method(*input_args)
    
    # Allow small floating point tolerance for rounding
    passed = (actual is not None) and (abs(actual - expected) < 1e-2)

    n = 1  # Constant time O(1) task
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="convert_temp",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
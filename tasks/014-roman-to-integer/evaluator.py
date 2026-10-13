from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(N)"},
    "space": {"complexity": "O(1)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input: line 1 = roman string
    s = in_text.rstrip("\r\n")
    
    # Parse expected output: integer
    expected = int(out_text.strip())

    return (s,), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    passed = (actual is not None) and (actual == expected)

    n = len(input_args[0])

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="romanToInt",
        parse_fn=parse_io,
        runner_fn=runner
    )
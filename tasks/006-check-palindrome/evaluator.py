from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input text (single line string s)
    lines = in_text.splitlines()
    s = lines[0] if lines else ""

    # Parse expected output (True or False)
    expected_str = out_text.strip().lower()
    expected = True if expected_str == "true" else False

    return (s,), expected

def runner(method, input_args: tuple, expected: bool):
    actual = method(*input_args)
    passed = (actual == expected)

    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="isPalindrome",
        parse_fn=parse_io,
        runner_fn=runner
    )
from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (1 card number on 1 line)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    nums = lines[0]

    # Parse expected output (true/false)
    raw_expected = out_text.strip().lower()
    expected = raw_expected in ("true", "1", "yes")

    return (nums,), expected

def runner(method, input_args: tuple, expected: bool):
    actual = method(*input_args)
    passed = (actual == expected)
    
    n = len(input_args[0])

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="validate_card",
        parse_fn=parse_io,
        runner_fn=runner,
    )
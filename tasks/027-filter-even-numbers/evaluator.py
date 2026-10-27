from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Preserve lines even if blank so empty arrays parse correctly
    lines = in_text.splitlines()
    nums = list(map(int, lines[0].split())) if lines and lines[0].strip() else []

    # Parse expected output as a list of integers
    expected = list(map(int, out_text.strip().split())) if out_text.strip() else []

    return (nums,), expected

def runner(method, input_args: tuple, expected: list[int]):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    
    passed = (actual == expected)
    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="filterEvens",
        parse_fn=parse_io,
        runner_fn=runner
    )
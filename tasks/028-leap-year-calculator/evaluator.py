from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Read two integers from input: startYear and endYear
    lines = in_text.splitlines()
    startYear = int(lines[0].strip())
    endYear = int(lines[1].strip())

    # Parse expected output as a list of integers
    expected = list(map(int, out_text.strip().split())) if out_text.strip() else []

    return (startYear, endYear), expected

def runner(method, input_args: tuple, expected: list[int]):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    
    passed = (actual == expected)
    # N represents the number of years in the range
    n = input_args[1] - input_args[0] + 1
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="findLeapYears",
        parse_fn=parse_io,
        runner_fn=runner
    )
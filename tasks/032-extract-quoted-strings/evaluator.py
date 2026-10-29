import json
from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (Line 1: text containing quotes, handle trailing newlines safely)
    lines = in_text.splitlines()
    text = lines[0] if len(lines) > 0 else ""

    # Parse expected output using json.loads to handle string lists safely
    expected = json.loads(out_text.strip())

    return (text,), expected

def runner(method, input_args: tuple, expected: list[str]):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    
    passed = (actual == expected)
    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="getQuotedStrings",
        parse_fn=parse_io,
        runner_fn=runner
    )
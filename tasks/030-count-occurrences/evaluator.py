import json

from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (Line 1: list/array representation, Line 2: target element JSON/literal)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    
    # Use json.loads to safely handle mixed types (strings, ints, floats, etc.)
    elements = json.loads(lines[0])
    target = json.loads(lines[1])

    # Parse expected output as an integer count
    expected = int(out_text.strip())

    return (elements, target), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    
    passed = (actual == expected)
    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="countOccurrences",
        parse_fn=parse_io,
        runner_fn=runner
    )
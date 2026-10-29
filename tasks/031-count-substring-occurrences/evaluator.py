from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (Line 1: text, Line 2: sub)
    # Using splitlines(keepends=False) to safely handle strings that might contain spaces
    lines = in_text.splitlines()
    text = lines[0] if len(lines) > 0 else ""
    sub = lines[1] if len(lines) > 1 else ""

    # Parse expected output as an integer count
    expected = int(out_text.strip())

    return (text, sub), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    
    passed = (actual == expected)
    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="countSubstringOccurrences",
        parse_fn=parse_io,
        runner_fn=runner
    )
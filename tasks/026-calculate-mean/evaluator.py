from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Preserve lines even if blank so empty arrays parse correctly
    lines = in_text.splitlines()
    nums = list(map(int, lines[0].split())) if lines and lines[0].strip() else []

    # Parse expected output as float
    expected = float(out_text.strip())

    return (nums,), expected

def runner(method, input_args: tuple, expected: float):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。浮動小数点数を返してください。"
    
    # Allow a small tolerance for floating point comparisons
    passed = isinstance(actual, (int, float)) and abs(actual - expected) < 1e-5
    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="calculateMean",
        parse_fn=parse_io,
        runner_fn=runner
    )
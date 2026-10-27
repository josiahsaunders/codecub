from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Preserve lines even if blank so empty arrays parse correctly
    lines = in_text.splitlines()
    nums = list(map(int, lines[0].split())) if lines[0].strip() else []
    target = int(lines[1].strip())

    # Parse expected output (single integer index)
    expected = int(out_text.strip())

    return (nums, target), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    
    passed = (actual == expected)
    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="findFirstOccurrence",
        parse_fn=parse_io,
        runner_fn=runner
    )
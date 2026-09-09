from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Line 1: space-separated integers for prices
    # Line 2: integer for discount percentage
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    prices = list(map(int, lines[0].split()))
    discount = int(lines[1])

    # Parse expected total (integer)
    expected = int(out_text.strip())

    return (prices, discount), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    passed = (actual == expected)

    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="calculateTotal",
        parse_fn=parse_io,
        runner_fn=runner
    )
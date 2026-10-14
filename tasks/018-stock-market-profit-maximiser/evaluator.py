from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (1 array of prices on 1st line)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    prices = list(map(int, lines[0].split()))

    # Parse expected output (single integer max profit)
    expected = int(out_text.strip())

    return (prices,), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    passed = (actual is not None) and (actual == expected)

    n = len(input_args[0])

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="maxProfit",
        parse_fn=parse_io,
        runner_fn=runner
    )
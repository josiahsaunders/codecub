from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input: Line 1 = arrival list, Line 2 = duration list
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    arrival = list(map(int, lines[0].split()))
    duration = list(map(int, lines[1].split()))

    # Parse expected output (space-separated list of indices)
    expected = list(map(int, out_text.strip().split()))

    return (arrival, duration), expected

def runner(method, input_args: tuple, expected: list[int]):
    actual = method(*input_args)
    passed = (actual is not None) and (actual == expected)

    n = len(input_args[0])

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="microwaveOrder",
        parse_fn=parse_io,
        runner_fn=runner
    )
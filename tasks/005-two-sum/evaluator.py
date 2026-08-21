from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (1 array on 1st line, target on 2nd line)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    nums = list(map(int, lines[0].split()))
    target = int(lines[1])

    # Parse expected output
    expected = list(map(int, out_text.strip().split()))

    return (nums, target), expected

def runner(method, input_args: tuple, expected: list[int]):
    actual = method(*input_args)
    passed = (actual is not None) and (sorted(actual) == sorted(expected))

    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="twoSum",
        parse_fn=parse_io,
        runner_fn=runner
    )
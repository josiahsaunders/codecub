from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (1 array on each line)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    a = list(map(int, lines[0].split()))
    b = list(map(int, lines[1].split()))

    # Parse expected output
    out_lines = [line.strip() for line in out_text.strip().splitlines() if line.strip()]
    expected = list(map(int, out_lines[0].split()))

    return (a, b), expected

def runner(method, input_args: tuple, expected: list[int]):
    actual = method(*input_args)
    passed = (actual == expected)
    
    n = len(input_args[0])
    # Run more iterations for smaller N so total time measured is well above noise floor
    if n <= 500:
        iterations = 500
    elif n <= 2000:
        iterations = 200
    else:
        iterations = 50
    return passed, actual, expected, n, iterations

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="array_pair_sum",
        parse_fn=parse_io,
        runner_fn=runner,
    )
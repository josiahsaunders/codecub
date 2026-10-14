from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(M * B * L)"},
    "space": {"complexity": "O(M)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input: Line 1 = message, Line 2 = space-separated banned words
    lines = in_text.splitlines()
    message = lines[0] if len(lines) > 0 else ""
    banned = lines[1].split() if len(lines) > 1 and lines[1].strip() else []

    # Parse expected output
    expected = out_text.strip("\r\n")

    return (message, banned), expected

def runner(method, input_args: tuple, expected: str):
    actual = method(*input_args)
    passed = (actual is not None) and (actual == expected)

    n = len(input_args[0])

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="filterMessage",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
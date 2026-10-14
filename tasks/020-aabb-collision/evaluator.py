from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(1)"},
    "space": {"complexity": "O(1)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input: Line 1 = box1 [x, y, w, h], Line 2 = box2 [x, y, w, h]
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    box1 = list(map(int, lines[0].split()))
    box2 = list(map(int, lines[1].split()))

    # Parse expected output (True or False)
    expected_str = out_text.strip().lower()
    expected = expected_str == "true"

    return (box1, box2), expected

def runner(method, input_args: tuple, expected: bool):
    actual = method(*input_args)
    passed = (actual is not None) and (bool(actual) == expected)

    # AABB check is O(1), report nominal scale factor as 1
    n = 1

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="checkCollision",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
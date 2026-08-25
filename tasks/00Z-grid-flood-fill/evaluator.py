from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(M * N)"},
    "space": {"complexity": "O(M * N)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    
    # Line 0: Matrix dimensions M and N
    m, n = map(int, lines[0].split())
    
    # Line 1-3: sr, sc, color
    sr = int(lines[1])
    sc = int(lines[2])
    color = int(lines[3])

    # Lines 4 to 4+M: Image grid rows
    image = [list(map(int, lines[4 + i].split())) for i in range(m)]

    # Parse expected output matrix
    out_lines = [line.strip() for line in out_text.strip().splitlines() if line.strip()]
    expected = [list(map(int, line.split())) for line in out_lines]

    return (image, sr, sc, color), expected

def runner(method, input_args: tuple, expected: list[list[int]]):
    image, sr, sc, color = input_args
    actual = method(image, sr, sc, color)
    passed = (actual == expected)

    rows = len(image)
    cols = len(image[0]) if rows > 0 else 0
    n = rows * cols

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="flood_fill",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
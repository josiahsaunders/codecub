from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(1)"},
    "space": {"complexity": "O(1)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Read catAge from input
    lines = in_text.splitlines()
    catAge = int(lines[0].strip())

    # Parse expected output as a single integer
    expected = int(out_text.strip())

    return (catAge,), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    
    passed = (actual == expected)
    # N can represent the cat age for sizing/benchmarking output metrics
    n = input_args[0]
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="calculateCatAge",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
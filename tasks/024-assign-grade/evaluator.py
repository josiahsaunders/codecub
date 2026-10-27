from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(1)"},
    "space": {"complexity": "O(1)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (single integer score on line 1)
    lines = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    score = int(lines[0])

    # Parse expected output (single string grade)
    expected = out_text.strip()

    return (score,), expected

def runner(method, input_args: tuple, expected: str):
    actual = method(*input_args)
    
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    
    passed = (actual == expected)
    # Since this is a scalar input task, N can be treated as 1 for metrics
    n = 1
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="assignGrade",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
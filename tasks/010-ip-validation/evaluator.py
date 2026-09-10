from evaluator_base import run_evaluator

STATIC_COMPLEXITY = {
    "time": {"complexity": "O(N)"},
    "space": {"complexity": "O(N)"}
}

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input (raw IP string)
    ip_address = in_text.strip()

    # Parse expected output (boolean string: "true" or "false")
    expected = out_text.strip().lower() == "true"

    return (ip_address,), expected

def runner(method, input_args: tuple, expected: bool):
    actual = method(*input_args)
    
    # Ensure explicit boolean return comparison
    passed = (actual is not None) and (bool(actual) == expected)

    n = len(input_args[0])
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="isValidIP",
        parse_fn=parse_io,
        runner_fn=runner,
        static_complexity=STATIC_COMPLEXITY
    )
from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Preserve spaces but drop trailing newlines from test input/output files
    s = in_text.rstrip("\r\n")
    expected = out_text.rstrip("\r\n")

    return (s,), expected

def runner(method, input_args: tuple, expected: str):
    actual = method(*input_args)
    passed = (actual is not None) and (actual == expected)

    n = len(input_args[0])

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="reverseString",
        parse_fn=parse_io,
        runner_fn=runner
    )
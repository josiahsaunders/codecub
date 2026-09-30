from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse input: line 1 = text (preserving spaces, stripping trailing newlines), line 2 = shift
    lines = in_text.rstrip("\r\n").splitlines()
    
    # Handle empty string edge cases gracefully
    if not lines:
        text = ""
        shift = 0
    elif len(lines) == 1:
        text = lines[0]
        shift = 0
    else:
        text = lines[0]
        shift = int(lines[1].strip())

    # Parse expected output
    expected = out_text.rstrip("\r\n")

    return (text, shift), expected

def runner(method, input_args: tuple, expected: str):
    actual = method(*input_args)
    passed = (actual is not None) and (actual == expected)

    n = len(input_args[0])

    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="caesarCipher",
        parse_fn=parse_io,
        runner_fn=runner
    )
from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse integer n from input
    n = int(in_text.strip())

    # Parse expected output list of strings
    # Converts format like '["1", "2", "Fizz"]' or multiline lines into list[str]
    raw_out = out_text.strip()
    if raw_out.startswith("[") and raw_out.endswith("]"):
        import ast
        expected = ast.literal_eval(raw_out)
    else:
        expected = [line.strip() for line in raw_out.splitlines() if line.strip()]

    return (n,), expected

def runner(method, input_args: tuple, expected: list[str]):
    actual = method(*input_args)
    passed = (actual == expected)
    n = input_args[0]
    
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="fizzBuzz",
        parse_fn=parse_io,
        runner_fn=runner
    )
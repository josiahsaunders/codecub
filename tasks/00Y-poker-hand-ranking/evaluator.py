import json
from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse json array input format
    hands = json.loads(in_text.strip())
    expected = int(out_text.strip())
    return (hands,), expected

def runner(method, input_args: tuple, expected: int):
    actual = method(*input_args)
    passed = (actual == expected)
    
    # N is the number of hands in the tournament payload
    n = len(input_args[0])
    return passed, actual, expected, n

def evaluate_task(user_code_str, in_text, out_text, test_index):
    # Dynamic O(N) evaluation using log-log benchmark fitting
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="find_winning_hand",
        parse_fn=parse_io,
        runner_fn=runner
    )
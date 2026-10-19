from solution import Solution

def test_example_1():
    sol = Solution()
    a = 3
    b = 5
    expected = 8
    
    actual = sol.add_two_numbers(a, b)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    a = -10
    b = 4
    expected = -6
    
    actual = sol.add_two_numbers(a, b)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    a = -6
    b = -9
    expected = -15
    
    actual = sol.add_two_numbers(a, b)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
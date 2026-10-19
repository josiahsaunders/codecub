from solution import Solution

def test_example_1():
    sol = Solution()
    s = "III"
    expected = 3
    
    actual = sol.romanToInt(s)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    s = "LVIII"
    expected = 58
    
    actual = sol.romanToInt(s)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    s = "MCMXCIV"
    expected = 1994
    
    actual = sol.romanToInt(s)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
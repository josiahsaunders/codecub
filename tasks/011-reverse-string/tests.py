from solution import Solution

def test_example_1():
    sol = Solution()
    s = "hello"
    expected = "olleh"
    
    actual = sol.reverseString(s)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    s = "Python"
    expected = "nohtyP"
    
    actual = sol.reverseString(s)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    s = "12345"
    expected = "54321"
    
    actual = sol.reverseString(s)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
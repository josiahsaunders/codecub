from solution import Solution

def test_example_1():
    sol = Solution()
    s = "aabccccaaa"
    expected = "a2b1c4a3"
    
    actual = sol.compressString(s)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    s = "abca"
    expected = "a1b1c1a1"
    
    actual = sol.compressString(s)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    s = ""
    expected = ""
    
    actual = sol.compressString(s)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
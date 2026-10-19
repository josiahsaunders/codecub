from solution import Solution

def test_example_1():
    sol = Solution()
    message = "This is a bad word example"
    banned = ["bad"]
    expected = "This is a *** word example"
    
    actual = sol.filterMessage(message, banned)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    message = "Hello HATE spam SPAM"
    banned = ["hate", "spam"]
    expected = "Hello **** **** ****"
    
    actual = sol.filterMessage(message, banned)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    message = "Clean message here"
    banned = ["bad", "evil"]
    expected = "Clean message here"
    
    actual = sol.filterMessage(message, banned)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
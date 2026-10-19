from solution import Solution

def test_example_1():
    sol = Solution()
    s = "A man, a plan, a canal: Panama"
    expected = True
    
    actual = sol.isPalindrome(s)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    s = "race a car"
    expected = False
    
    actual = sol.isPalindrome(s)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    s = " "
    expected = True
    
    actual = sol.isPalindrome(s)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
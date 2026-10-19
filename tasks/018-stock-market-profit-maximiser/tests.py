from solution import Solution

def test_example_1():
    sol = Solution()
    prices = [7, 1, 5, 3, 6, 4]
    expected = 5
    
    actual = sol.maxProfit(prices)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    prices = [7, 6, 4, 3, 1]
    expected = 0
    
    actual = sol.maxProfit(prices)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    prices = [2, 4, 1]
    expected = 2
    
    actual = sol.maxProfit(prices)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
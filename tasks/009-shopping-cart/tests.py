from solution import Solution

def test_example_1():
    sol = Solution()
    prices = [1000, 2000, 3000]
    discount = 10
    expected = 5400
    
    actual = sol.calculateTotal(prices, discount)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    prices = [500, 1500]
    discount = 0
    expected = 2000
    
    actual = sol.calculateTotal(prices, discount)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    prices = [299, 499]
    discount = 20
    expected = 638
    
    actual = sol.calculateTotal(prices, discount)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
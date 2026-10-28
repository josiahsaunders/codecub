from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    prices = [1000, 2000, 3000]
    discount = 10
    
    # 2. 期待される結果（正解）の設定
    expected = 5400
    
    # 3. 自分の関数を実行
    actual = sol.calculateTotal(prices, discount)
    
    # 4. 結果の検証（アサーション）
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
from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    prices = [7, 1, 5, 3, 6, 4]
    
    # 2. 期待される結果（正解）の設定
    expected = 5

    # 3. 自分の関数を実行    
    actual = sol.maxProfit(prices)
    
    # 4. 結果の検証（アサーション）
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
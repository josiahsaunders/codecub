from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    arrival = [0, 2, 4]
    duration = [5, 2, 1]
    
    # 2. 期待される結果（正解）の設定
    expected = [0, 2, 1]

    # 3. 自分の関数を実行    
    actual = sol.microwaveOrder(arrival, duration)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    arrival = [0, 1, 3]
    duration = [3, 1, 2]
    expected = [0, 1, 2]
    
    actual = sol.microwaveOrder(arrival, duration)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    arrival = [0, 1, 2]
    duration = [10, 2, 1]
    expected = [0, 2, 1]
    
    actual = sol.microwaveOrder(arrival, duration)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
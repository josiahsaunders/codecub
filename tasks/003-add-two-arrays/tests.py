from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    a = [1, 2, 3]
    b = [4, 5, 6]
    
    # 2. 期待される結果（正解）の設定
    expected = [5, 7, 9]
    
    # 3. 自分の関数を実行
    actual = sol.array_pair_sum(a, b)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    a = [-1, -2, -3, -4]
    b = [-5, -6, -7, -8]
    expected = [-6, -8, -10, -12]
    
    actual = sol.array_pair_sum(a, b)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    a = [1]
    b = [-1]
    expected = [0]
    
    actual = sol.array_pair_sum(a, b)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
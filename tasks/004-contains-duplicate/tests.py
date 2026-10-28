from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    nums = [1, 2, 3, 1]
    
    # 2. 期待される結果（正解）の設定
    expected = True
    
    # 3. 自分の関数を実行
    actual = sol.contains_duplicate(nums)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    nums = [1, 2, 3, 4]
    expected = False
    
    actual = sol.contains_duplicate(nums)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
    expected = True
    
    actual = sol.contains_duplicate(nums)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
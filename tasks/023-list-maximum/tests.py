from solution import Solution

def test_example_1():
    """
    テスト例 1: 基本的な配列
    入力: nums = [5, 3, 8, 1, 4]
    期待される出力: 8
    """
    sol = Solution()
    
    # 1. 入力データの設定
    nums = [5, 3, 8, 1, 4]
    
    # 2. 期待される結果（正解）の設定
    expected = 8
    
    # 3. 自分の関数を実行
    actual = sol.findMaximum(nums)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 負の数を含む配列
    入力: nums = [-2, 0, -10, -8, -5]
    期待される出力: 0
    """
    sol = Solution()
    
    nums = [-2, 0, -10, -8, -5]
    expected = 0
    
    actual = sol.findMaximum(nums)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 要素が1つだけの配列
    入力: nums = [7]
    期待される出力: 7
    """
    sol = Solution()
    
    nums = [7]
    expected = 7
    
    actual = sol.findMaximum(nums)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
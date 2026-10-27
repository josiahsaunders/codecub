from solution import Solution

def test_example_1():
    """
    テスト例 1: 偶数と奇数が混ざった基本的なリスト
    入力: nums = [1, 2, 3, 4, 5, 6]
    期待される出力: [2, 4, 6]
    """
    sol = Solution()
    
    # 1. 入力データの設定
    nums = [1, 2, 3, 4, 5, 6]
    
    # 2. 期待される結果（正解）の設定
    expected = [2, 4, 6]
    
    # 3. 自分の関数を実行
    actual = sol.filterEvens(nums)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 偶数が含まれない場合（すべて奇数）
    入力: nums = [1, 3, 5, 7]
    期待される出力: []
    """
    sol = Solution()
    
    nums = [1, 3, 5, 7]
    expected = []
    
    actual = sol.filterEvens(nums)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 負の数や0が含まれる場合
    入力: nums = [-4, -3, 0, 2]
    期待される出力: [-4, 0, 2]
    """
    sol = Solution()
    
    nums = [-4, -3, 0, 2]
    expected = [-4, 0, 2]
    
    actual = sol.filterEvens(nums)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
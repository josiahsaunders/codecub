from solution import Solution

def test_example_1():
    """
    テスト例 1: リスト内にターゲットが複数存在する場合
    入力: nums = [10, 20, 30, 20, 40], target = 20
    期待される出力: 1
    """
    sol = Solution()
    
    # 1. 入力データの設定
    nums = [10, 20, 30, 20, 40]
    target = 20
    
    # 2. 期待される結果（正解）の設定
    expected = 1
    
    # 3. 自分の関数を実行
    actual = sol.findFirstOccurrence(nums, target)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: リスト内にターゲットが存在しない場合
    入力: nums = [5, 7, 9, 11], target = 6
    期待される出力: -1
    """
    sol = Solution()
    
    nums = [5, 7, 9, 11]
    target = 6
    expected = -1
    
    actual = sol.findFirstOccurrence(nums, target)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: すべての要素がターゲットと同じ場合
    入力: nums = [4, 4, 4, 4], target = 4
    期待される出力: 0
    """
    sol = Solution()
    
    nums = [4, 4, 4, 4]
    target = 4
    expected = 0
    
    actual = sol.findFirstOccurrence(nums, target)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
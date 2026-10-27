from solution import Solution

def test_example_1():
    """
    テスト例 1: 基本的な数値のリスト
    入力: nums = [2, 4, 6, 8]
    期待される出力: 5.0
    """
    sol = Solution()
    
    # 1. 入力データの設定
    nums = [2, 4, 6, 8]
    
    # 2. 期待される結果（正解）の設定
    expected = 5.0
    
    # 3. 自分の関数を実行
    actual = sol.calculateMean(nums)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。浮動小数点数を返してください。"
    assert abs(actual - expected) < 1e-5, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 要素数が奇数のリスト
    入力: nums = [1, 2, 3]
    期待される出力: 2.0
    """
    sol = Solution()
    
    nums = [1, 2, 3]
    expected = 2.0
    
    actual = sol.calculateMean(nums)
    
    assert actual is not None, "戻り値が None です。浮動小数点数を返してください。"
    assert abs(actual - expected) < 1e-5, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 要素が1つだけのリスト
    入力: nums = [10]
    期待される出力: 10.0
    """
    sol = Solution()
    
    nums = [10]
    expected = 10.0
    
    actual = sol.calculateMean(nums)
    
    assert actual is not None, "戻り値が None です。浮動小数点数を返してください。"
    assert abs(actual - expected) < 1e-5, f"期待される出力: {expected}、実際の出力: {actual}"
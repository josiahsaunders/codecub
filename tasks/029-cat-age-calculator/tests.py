from solution import Solution

def test_example_1():
    """
    テスト例 1: 猫の年齢が 1歳 の場合
    入力: catAge = 1
    期待される出力: 15
    """
    sol = Solution()
    
    # 1. 入力データの設定
    catAge = 1
    
    # 2. 期待される結果（正解）の設定
    expected = 15
    
    # 3. 自分の関数を実行
    actual = sol.calculateCatAge(catAge)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 猫の年齢が 2歳 の場合
    入力: catAge = 2
    期待される出力: 24
    """
    sol = Solution()
    
    catAge = 2
    expected = 24
    
    actual = sol.calculateCatAge(catAge)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 猫の年齢が 3歳以上（5歳）の場合
    入力: catAge = 5
    期待される出力: 36
    """
    sol = Solution()
    
    catAge = 5
    expected = 36
    
    actual = sol.calculateCatAge(catAge)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
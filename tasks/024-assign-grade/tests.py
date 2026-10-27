from solution import Solution

def test_example_1():
    """
    テスト例 1: 高い点数の場合（HD）
    入力: score = 88
    期待される出力: "HD"
    """
    sol = Solution()
    
    # 1. 入力データの設定
    score = 88
    
    # 2. 期待される結果（正解）の設定
    expected = "HD"
    
    # 3. 自分の関数を実行
    actual = sol.assignGrade(score)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 中間層の点数の場合（C）
    入力: score = 72
    期待される出力: "C"
    """
    sol = Solution()
    
    score = 72
    expected = "C"
    
    actual = sol.assignGrade(score)
    
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 不合格の点数の場合（F）
    入力: score = 42
    期待される出力: "F"
    """
    sol = Solution()
    
    score = 42
    expected = "F"
    
    actual = sol.assignGrade(score)
    
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
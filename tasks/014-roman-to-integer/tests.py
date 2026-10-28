from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    s = "III"
    
    # 2. 期待される結果（正解）の設定
    expected = 3

    # 3. 自分の関数を実行    
    actual = sol.romanToInt(s)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    s = "LVIII"
    expected = 58
    
    actual = sol.romanToInt(s)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    s = "MCMXCIV"
    expected = 1994
    
    actual = sol.romanToInt(s)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
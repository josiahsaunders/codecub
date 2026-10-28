from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    temp = 25.0
    unit = "F"
    
    # 2. 期待される結果（正解）の設定
    expected = 77.0

    # 3. 自分の関数を実行    
    actual = sol.convert_temp(temp, unit)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。小数値を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    temp = 0.0
    unit = "K"
    expected = 273.2
    
    actual = sol.convert_temp(temp, unit)
    assert actual is not None, "戻り値が None です。小数値を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    temp = -40.0
    unit = "F"
    expected = -40
    
    actual = sol.convert_temp(temp, unit)
    assert actual is not None, "戻り値が None です。小数値を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
from solution import Solution

def test_example_1():
    """
    テスト例 1: 世紀の変わり目を含む通常の範囲
    入力: startYear = 2000, endYear = 2024
    期待される出力: [2000, 2004, 2008, 2012, 2016, 2020, 2024]
    """
    sol = Solution()
    
    # 1. 入力データの設定
    startYear = 2000
    endYear = 2024
    
    # 2. 期待される結果（正解）の設定
    expected = [2000, 2004, 2008, 2012, 2016, 2020, 2024]
    
    # 3. 自分の関数を実行
    actual = sol.findLeapYears(startYear, endYear)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 100で割り切れるが400で割り切れない年（うるう年ではない）を含む範囲
    入力: startYear = 1900, endYear = 1905
    期待される出力: [1904]
    """
    sol = Solution()
    
    startYear = 1900
    endYear = 1905
    expected = [1904]
    
    actual = sol.findLeapYears(startYear, endYear)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 範囲内にうるう年が含まれない場合
    入力: startYear = 2021, endYear = 2023
    期待される出力: []
    """
    sol = Solution()
    
    startYear = 2021
    endYear = 2023
    expected = []
    
    actual = sol.findLeapYears(startYear, endYear)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
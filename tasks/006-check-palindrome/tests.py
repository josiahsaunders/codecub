from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    s = "A man, a plan, a canal: Panama"
    
    # 2. 期待される結果（正解）の設定
    expected = True
    
    # 3. 自分の関数を実行
    actual = sol.isPalindrome(s)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    s = "race a car"
    expected = False
    
    actual = sol.isPalindrome(s)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    s = " "
    expected = True
    
    actual = sol.isPalindrome(s)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
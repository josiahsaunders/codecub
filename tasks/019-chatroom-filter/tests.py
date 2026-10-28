from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    message = "This is a bad word example"
    banned = ["bad"]
    
    # 2. 期待される結果（正解）の設定
    expected = "This is a *** word example"

    # 3. 自分の関数を実行    
    actual = sol.filterMessage(message, banned)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    message = "Hello HATE spam SPAM"
    banned = ["hate", "spam"]
    expected = "Hello **** **** ****"
    
    actual = sol.filterMessage(message, banned)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    message = "Clean message here"
    banned = ["bad", "evil"]
    expected = "Clean message here"
    
    actual = sol.filterMessage(message, banned)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
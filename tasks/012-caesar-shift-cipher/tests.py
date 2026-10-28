from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    text = "abc"
    shift = 3
    
    # 2. 期待される結果（正解）の設定
    expected = "def"
    
    # 3. 自分の関数を実行
    actual = sol.caesarCipher(text, shift)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    text = "Hello, World!"
    shift = 5
    expected = "Mjqqt, Btwqi!"
    
    actual = sol.caesarCipher(text, shift)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    text = "xyz"
    shift = 3
    expected = "abc"
    
    actual = sol.caesarCipher(text, shift)
    assert actual is not None, "戻り値が None です。文字列を返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"
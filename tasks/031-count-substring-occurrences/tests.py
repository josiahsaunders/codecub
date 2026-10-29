from solution import Solution

def test_example_1():
    """
    テスト例 1: 部分文字列が複数回含まれる場合（通常ケース）
    入力: text = "abababa", sub = "aba"
    期待される出力: 3
    """
    sol = Solution()
    
    # 1. 入力データの設定
    text = "abababa"
    sub = "aba"
    
    # 2. 期待される結果（正解）の設定
    expected = 3
    
    # 3. 自分の関数を実行
    actual = sol.countSubstringOccurrences(text, sub)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 1文字の部分文字列を数える場合
    入力: text = "hello world", sub = "l"
    期待される出力: 3
    """
    sol = Solution()
    
    text = "hello world"
    sub = "l"
    expected = 3
    
    actual = sol.countSubstringOccurrences(text, sub)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 重なり合う部分文字列が含まれる場合
    入力: text = "aaaa", sub = "aa"
    期待される出力: 3
    """
    sol = Solution()
    
    text = "aaaa"
    sub = "aa"
    expected = 3
    
    actual = sol.countSubstringOccurrences(text, sub)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
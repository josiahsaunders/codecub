from solution import Solution

def test_example_1():
    """
    テスト例 1: 1つの引用符付き文字列が含まれる場合
    入力: text = "He said, \"Hello, world!\" and left."
    期待される出力: ["Hello, world!"]
    """
    sol = Solution()
    
    # 1. 入力データの設定
    text = 'He said, "Hello, world!" and left.'
    
    # 2. 期待される結果（正解）の設定
    expected = ["Hello, world!"]
    
    # 3. 自分の関数を実行
    actual = sol.getQuotedStrings(text)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 複数の引用符付き文字列が含まれる場合
    入力: text = "Item \"apple\", price \"100 yen\", and \"sale\""
    期待される出力: ["apple", "100 yen", "sale"]
    """
    sol = Solution()
    
    text = 'Item "apple", price "100 yen", and "sale"'
    expected = ["apple", "100 yen", "sale"]
    
    actual = sol.getQuotedStrings(text)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: 引用符が含まれない場合
    入力: text = "No quotes here at all."
    期待される出力: []
    """
    sol = Solution()
    
    text = "No quotes here at all."
    expected = []
    
    actual = sol.getQuotedStrings(text)
    
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
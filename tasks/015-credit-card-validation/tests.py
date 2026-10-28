from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    card_number = "79927398713"
    
    # 2. 期待される結果（正解）の設定
    expected = True

    # 3. 自分の関数を実行    
    actual = sol.validate_card(card_number)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。True または False を返してください。。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    card_number = "4532-7520-1234-5673"
    expected = False
    
    actual = sol.validate_card(card_number)
    assert actual is not None, "戻り値が None です。True または False を返してください。。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    card_number = "4992 7398 716"
    expected = True
    
    actual = sol.validate_card(card_number)
    assert actual is not None, "戻り値が None です。True または False を返してください。。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
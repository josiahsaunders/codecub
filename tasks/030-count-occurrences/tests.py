from solution import Solution

def test_example_1():
    """
    テスト例 1: 整数のリストから指定した数値の出現回数を数える場合
    入力: elements = [1, 2, 3, 2, 4, 2], target = 2
    期待される出力: 3
    """
    sol = Solution()
    
    # 1. 入力データの設定
    elements = [1, 2, 3, 2, 4, 2]
    target = 2
    
    # 2. 期待される結果（正解）の設定
    expected = 3
    
    # 3. 自分の関数を実行
    actual = sol.countOccurrences(elements, target)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """
    テスト例 2: 文字列のリストから指定した文字列の出現回数を数える場合
    入力: elements = ["apple", "banana", "apple", "orange", "apple"], target = "apple"
    期待される出力: 3
    """
    sol = Solution()
    
    elements = ["apple", "banana", "apple", "orange", "apple"]
    target = "apple"
    expected = 3
    
    actual = sol.countOccurrences(elements, target)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """
    テスト例 3: リスト内にターゲットの要素が含まれない場合
    入力: elements = [1, 2, 3], target = 5
    期待される出力: 0
    """
    sol = Solution()
    
    elements = [1, 2, 3]
    target = 5
    expected = 0
    
    actual = sol.countOccurrences(elements, target)
    
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
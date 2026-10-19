from solution import Solution

def test_example_1():
    sol = Solution()
    hands = [["2H", "3H", "4H", "5H", "6H"], ["KS", "KH", "KD", "9H", "2C"]]
    expected = 0
    
    actual = sol.find_winning_hand(hands)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    hands = [["AH", "KD", "QC", "JS", "9H"], ["AC", "KS", "QD", "JC", "8S"]]
    expected = 0
    
    actual = sol.find_winning_hand(hands)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    hands = [["AH", "KH", "QH", "JH", "TH"], ["AS", "KS", "QS", "JS", "TS"]]
    expected = 0
    
    actual = sol.find_winning_hand(hands)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
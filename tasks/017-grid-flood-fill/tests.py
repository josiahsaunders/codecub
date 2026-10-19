from solution import Solution

def test_example_1():
    sol = Solution()
    image = [[1, 1, 1], [1, 1, 0], [1, 0, 1]]
    sr = 1
    sc = 1
    color = 2
    expected = [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
    
    actual = sol.flood_fill(image, sr, sc, color)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    image = [[0, 0, 0], [0, 0, 0]]
    sr = 0
    sc = 0
    color = 0
    expected = [[0, 0, 0], [0, 0, 0]]
    
    actual = sol.flood_fill(image, sr, sc, color)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    image = [[5]]
    sr = 0
    sc = 0
    color = 9
    expected = [[9]]
    
    actual = sol.flood_fill(image, sr, sc, color)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    maze = ["S.#.", ".#.#", "...E"]
    
    # 2. 期待される結果（正解）の設定
    expected = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3]]
    
    # 3. 自分の関数を実行
    actual = sol.shortestPath(maze)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    maze = ["S.E", "...", "..."]
    expected = [[0, 0], [0, 1], [0, 2]]
    
    actual = sol.shortestPath(maze)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    maze = ["S.", ".E"]
    expected1 = [[0, 0], [1, 0], [1, 1]]
    expected2 = [[0, 0], [0, 1], [1, 1]]
    
    actual = sol.shortestPath(maze)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected1 or actual == expected2, f"期待される出力: {expected1} または {expected2}、実際の出力: {actual}"
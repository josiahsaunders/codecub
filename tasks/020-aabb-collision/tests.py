from solution import Solution

def test_example_1():
    sol = Solution()
    box1 = [0, 0, 5, 5]
    box2 = [3, 3, 5, 5]
    expected = True
    
    actual = sol.checkCollision(box1, box2)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    box1 = [0, 0, 2, 2]
    box2 = [3, 3, 2, 2]
    expected = False
    
    actual = sol.checkCollision(box1, box2)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    box1 = [0, 0, 4, 4]
    box2 = [4, 0, 4, 4]
    expected = True
    
    actual = sol.checkCollision(box1, box2)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
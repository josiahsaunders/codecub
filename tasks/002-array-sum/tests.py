from solution import Solution

def test_example_1():
    sol = Solution()
    nums = [1, 2, 3]
    expected = 6
    
    actual = sol.array_sum(nums)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    nums = [-5, 4]
    expected = -1
    
    actual = sol.array_sum(nums)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    nums = [0, 2, 4, 6, 8, 10]
    expected = 30
    
    actual = sol.array_sum(nums)
    assert actual is not None, "戻り値が None です。整数を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
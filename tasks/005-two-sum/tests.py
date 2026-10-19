from solution import Solution

def test_example_1():
    sol = Solution()
    nums = [6, 1, 4, 22]
    target = 10
    expected = [0, 2]
    
    actual = sol.twoSum(nums, target)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    nums = [8, 3, 5]
    target = 8
    expected = [1, 2]
    
    actual = sol.twoSum(nums, target)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    nums = [5, 5]
    target = 10
    expected = [0, 1]
    
    actual = sol.twoSum(nums, target)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"
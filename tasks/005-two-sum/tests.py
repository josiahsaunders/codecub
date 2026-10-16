from solution import Solution

def test_example_1():
    """例1: [2, 7, 11, 15], target = 9"""
    sol = Solution()
    nums = [2, 7, 11, 15]
    target = 9
    expected = [0, 1]
    
    actual = sol.twoSum(nums, target)
    assert actual is not None, "戻り値が None です。インデックスのリストを返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    """例2: [3, 2, 4], target = 6"""
    sol = Solution()
    nums = [3, 2, 4]
    target = 6
    expected = [1, 2]
    
    actual = sol.twoSum(nums, target)
    assert actual is not None, "戻り値が None です。インデックスのリストを返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    """例3: [3, 3], target = 6"""
    sol = Solution()
    nums = [3, 3]
    target = 6
    expected = [0, 1]
    
    actual = sol.twoSum(nums, target)
    assert actual is not None, "戻り値が None です。インデックスのリストを返してください。"
    assert sorted(actual) == sorted(expected), f"期待される出力: {expected}、実際の出力: {actual}"
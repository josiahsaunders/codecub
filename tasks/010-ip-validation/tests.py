from solution import Solution

def test_example_1():
    sol = Solution()
    ip_address = "192.168.1.1"
    expected = True
    
    actual = sol.isValidIP(ip_address)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    ip_address = "256.100.0.1"
    expected = False
    
    actual = sol.isValidIP(ip_address)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    ip_address = "192.168.01.1"
    expected = False
    
    actual = sol.isValidIP(ip_address)
    assert actual is not None, "戻り値が None です。True または False を返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
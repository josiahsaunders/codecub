from solution import Solution

def test_example_1():
    sol = Solution()
    
    # 1. 入力データの設定
    n = 3
    
    # 2. 期待される結果（正解）の設定
    expected = ["1", "2", "Fizz"]
    
    # 3. 自分の関数を実行
    actual = sol.fizzBuzz(n)
    
    # 4. 結果の検証（アサーション）
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_2():
    sol = Solution()
    n = 5
    expected = ["1", "2", "Fizz", "4", "Buzz"]
    
    actual = sol.fizzBuzz(n)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"


def test_example_3():
    sol = Solution()
    n = 15
    expected = ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
    
    actual = sol.fizzBuzz(n)
    assert actual is not None, "戻り値が None です。リストを返してください。"
    assert actual == expected, f"期待される出力: {expected}、実際の出力: {actual}"
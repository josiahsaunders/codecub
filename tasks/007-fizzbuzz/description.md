### 概要
整数 `n` が与えられたとき、`1` から `n` までのカウント結果を表す文字列の配列（リスト）を返してください。

各要素（`1`-indexed の `i` 番目）のルールは以下の通りです：
- `i` が **3 と 5 の両方** で割り切れる場合： `"FizzBuzz"`
- `i` が **3** で割り切れる場合： `"Fizz"`
- `i` が **5** で割り切れる場合： `"Buzz"`
- 上記のどれにも当てはまらない場合： `i` を文字列にしたもの（例: `"1"`）

*(Given an integer `n`, return a string array (1-indexed) where `result[i]` is `"FizzBuzz"` if `i` is divisible by 3 and 5, `"Fizz"` if divisible by 3, `"Buzz"` if divisible by 5, or `str(i)` otherwise.)*

---

### 制約
- `1 <= n <= 10⁵`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(N)`（出力配列を除く場合は `O(1)`）

---

### 入出力例
**例 1:**
- **入力:** `n = 3`
- **出力:** `["1", "2", "Fizz"]`

**例 2:**
- **入力:** `n = 5`
- **出力:** `["1", "2", "Fizz", "4", "Buzz"]`

**例 3:**
- **入力:** `n = 15`
- **出力:** `["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]`
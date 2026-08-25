### 概要
同じ長さの2つの整数配列 `a` と `b` が与えられます。対応する要素同士を足し合わせた新しい配列を返す関数 `array_pair_sum(a, b)` を実装してください。

*(Given two integer arrays `a` and `b` of equal length, implement the function `array_pair_sum(a, b)` that returns a new array containing the element-wise sum of the two arrays.)*

---

### 制約
- `1 &lt;= a.length, b.length &lt;= 10⁴`
- `-10⁹ &lt;= a[i], b[i] &lt;= 10⁹`
- `a.length == b.length`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `a = [1, 2, 3]`, `b = [4, 5, 6]`
- **出力:** `[5, 7, 9]`

**例 2:**
- **入力:** `a = [-1, -2, -3, -4]`, `b = [-5, -6, -7, -8]`
- **出力:** `[-6, -8, -10, -12]`

**例 3:**
- **入力:** `a = [1]`, `b = [-1]`
- **出力:** `[0]`
### 概要
与えられた整数の配列 `nums` に対し、その要素の平均値（算術平均）を浮動小数点数（float）で返してください。もし配列が空の場合は `0.0` を返してください。

*(Given an array of integers `nums`, return the arithmetic mean (average) of its elements as a float. If the array is empty, return `0.0`.)*

---

### 制約
- `0 <= nums.length <= 10⁵`
- `-10⁹ <= nums[i] <= 10⁹`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `nums = [2, 4, 6, 8]`
- **出力:** `5.0`
- **説明:** 全要素の合計は `20` で、要素数は `4` です。`20 / 4 = 5.0` になります。

**例 2:**
- **入力:** `nums = [1, 2, 3]`
- **出力:** `2.0`
- **説明:** 全要素の合計は `6` で、要素数は `3` です。`6 / 3 = 2.0` になります。

**例 3:**
- **入力:** `nums = [10]`
- **出力:** `10.0`
- **説明:** 要素が1つの場合、その値自体が平均値になります。
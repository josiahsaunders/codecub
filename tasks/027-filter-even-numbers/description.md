### 概要
与えられた整数の配列 `nums` に対し、その中から偶数（2で割り切れる数）のみを元の順序のまま抽出した新しい配列を返してください。もし偶数が一つもない場合は空の配列 `[]` を返してください。

*(Given an array of integers `nums`, return a new array containing all the even numbers (divisible by 2) from the input array in their original order. If there are no even numbers, return an empty array `[]`.)*

---

### 制約
- `0 <= nums.length <= 10⁵`
- `-10⁹ <= nums[i] <= 10⁹`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(N)` (結果格納用配列のため)

---

### 入出力例
**例 1:**
- **入力:** `nums = [1, 2, 3, 4, 5, 6]`
- **出力:** `[2, 4, 6]`
- **説明:** 偶数である `2`、`4`、`6` を順番に抽出します。

**例 2:**
- **入力:** `nums = [1, 3, 5, 7]`
- **出力:** `[]`
- **説明:** 偶数が含まれていないため、空の配列を返します。

**例 3:**
- **入力:** `nums = [-4, -3, 0, 2]`
- **出力:** `[-4, 0, 2]`
- **説明:** 負の数や `0` も偶数の判定対象に含まれます（`-4 % 2 == 0`, `0 % 2 == 0`, `2 % 2 == 0`）。
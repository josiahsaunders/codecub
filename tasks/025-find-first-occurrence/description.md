### 概要
与えられた整数の配列 `nums` と検索値 `target` に対し、配列内で `target` が最初に登場する位置（インデックス）を返してください。もし `target` が配列内に存在しない場合は `-1` を返してください。

*(Given an array of integers `nums` and a target value `target`, return the index of the first occurrence of `target` in the array. If `target` is not present, return `-1`.)*

---

### 制約
- `0 <= nums.length <= 10⁵`
- `-10⁹ <= nums[i], target <= 10⁹`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `nums = [10, 20, 30, 20, 40]`, `target = 20`
- **出力:** `1`
- **説明:** `20` はインデックス `1` とインデックス `3` にありますが、最初に登場するのはインデックス `1` です。

**例 2:**
- **入力:** `nums = [5, 7, 9, 11]`, `target = 6`
- **出力:** `-1`
- **説明:** `6` は配列内に存在しないため、`-1` を返します。

**例 3:**
- **入力:** `nums = [4, 4, 4, 4]`, `target = 4`
- **出力:** `0`
- **説明:** 最初に出現する `4` はインデックス `0` にあります。
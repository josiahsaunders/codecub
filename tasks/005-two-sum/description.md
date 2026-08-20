### 概要
与えられた整数の配列 `nums` と目標値 `target` に対し、足して `target` になる2つの数字のインデックス（位置）を返してください。

*(Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.)*

### 制約
- 答えは必ず1つだけ存在します。
- 同じ要素を2回使用することはできません。
- `-2 &lt;= nums.length &lt;= 10⁴`
- `-10⁹ &lt;= nums[i] &lt;= 10⁹`
- `-10⁹ &lt;= target &lt;= 10⁹`

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(N)`

### 入出力例

**例 1:**
- **入力:** `nums = [6, 1, 4, 22]`, `target = 10`
- **出力:** `[0, 2]`
- **説明:** `nums[0] + nums[2] == 6 + 4 == 10` なので、`[0, 2]` を返します。

**例 2:**
- **入力:** `nums = [8, 3, 5]`, `target = 8`
- **出力:** `[1, 2]`
- **説明:** `nums[1] + nums[2] == 3 + 5 == 8` なので、`[1, 2]` を返します。

**例 3:**
- **入力:** `nums = [5, 5]`, `target = 10`
- **出力:** `[0, 1]`
- **説明:** `nums[0] + nums[1] == 5 + 5 == 10` なので、`[0, 1]` を返します。
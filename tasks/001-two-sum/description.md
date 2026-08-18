与えられた整数の配列 `nums` と目標値 `target` に対し、足して `target` になる2つの数字のインデックス（位置）を返してください。

*(Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.)*

### 制約事項 (Constraints)
- 答えは必ず1つだけ存在します。
- 同じ要素を2回使用することはできません。

### 入出力例 (Examples)

**例 1:**
- **入力 (Input):** `nums = [6, 1, 4, 22]`, `target = 10`
- **出力 (Output):** `[0, 2]`
- **説明 (Explanation):** `nums[0] + nums[2] == 6 + 4 == 10` なので、`[0, 2]` を返します。

**例 2:**
- **入力 (Input):** `nums = [8, 3, 5]`, `target = 8`
- **出力 (Output):** `[1, 2]`
- **説明 (Explanation):** `nums[1] + nums[2] == 3 + 5 == 8` なので、`[1, 2]` を返します。

**例 3:**
- **入力 (Input):** `nums = [5, 5]`, `target = 10`
- **出力 (Output):** `[0, 1]`
- **説明 (Explanation):** `nums[0] + nums[1] == 5 + 5 == 10` なので、`[0, 1]` を返します。
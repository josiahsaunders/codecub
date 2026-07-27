与えられた整数の配列 `nums` と目標値 `target` に対し、足して `target` になる2つの数字のインデックス（位置）を返してください。

*(Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.)*

### 制約事項 (Constraints)
- 答えは必ず1つだけ存在します。
- 同じ要素を2回使用することはできません。

### 入出力例 (Examples)

**例 1:**
- **入力 (Input):** `nums = [2, 7, 11, 15]`, `target = 9`
- **出力 (Output):** `[0, 1]`
- **説明 (Explanation):** `nums[0] + nums[1] == 2 + 7 == 9` なので、`[0, 1]` を返します。
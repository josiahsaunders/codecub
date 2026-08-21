### 概要
与えられた整数の配列内に、2回以上出現する要素（重複）が含まれているかどうかを判定する関数 `contains_duplicate` を作成してください。

配列内に重複する値が1つでも存在する場合は `True`（または `true`）を、すべての要素が固有（ユニーク）である場合は `False`（または `false`）を返してください。

*Given an array of integers, write a function `contains_duplicate` that checks whether the array contains any duplicate elements. Return `True` (or `true`) if any value appears at least twice, and `False` (or `false`) if every element is distinct.*

### 制約
- 配列の長さ (`N`): `1 &lt;= N &lt;= 10,000`
- 要素の値: `-10^9 &lt;= nums[i] &lt;= 10^9`

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(N)`

### 入出力例
**例 1:**
- **入力:** `[1, 2, 3, 1]`
- **出力:** `True`

**例 2:**
- **入力:** `[1, 2, 3, 4]`
- **出力:** `False`

**例 3:**
- **入力:** `[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]`
- **出力:** `True`
### 概要
与えられたリスト `elements` と、探したい要素 `target` に対し、リストの中にその要素が何回含まれているかを数えて整数で返してください。要素は整数だけでなく、文字列などさまざまな型が含まれる場合があります。

*(Given a list of elements `elements` and a target element `target`, count and return the number of times the target element appears in the list.)*

---

### 制約
- `0 <= elements.length <= 10⁵`
- `target` およびリスト内の要素の型は、整数、文字列などの任意の型になります。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `elements = [1, 2, 3, 2, 4, 2]`, `target = 2`
- **出力:** `3`
- **説明:** `2` がリスト内に `3` 回含まれています。

**例 2:**
- **入力:** `elements = ["apple", "banana", "apple", "orange", "apple"]`, `target = "apple"`
- **出力:** `3`
- **説明:** 文字列 `"apple"` がリスト内に `3` 回含まれています。

**例 3:**
- **入力:** `elements = [1, 2, 3]`, `target = 5`
- **出力:** `0`
- **説明:** リスト内に `5` は含まれていないため、`0` を返します。
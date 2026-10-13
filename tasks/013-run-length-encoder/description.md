### 概要
与えられた文字列 `s` に対し、連続する同じ文字をその文字と出現回数のペアに置き換えて圧縮する関数 `compressString(s)` を実装してください。

*(Given a string `s`, compress it by replacing consecutive identical characters with the character followed by its count.)*

---

### 仕様
- 連続する同じ文字は `[文字][回数]` の形式で連結します (例: 3つの `'a'` は `"a3"`)。
- 1文字しか現れない場合でも、回数 `1` を付与します (例: `'a'` は `"a1"`)。
- 空の文字列が与えられた場合は、空の文字列を返します。

---

### 制同 (Constraints)
- `0 <= len(s) <= 10⁵`
- `s` には英数字および記号が含まれます。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)` （$N$ は文字列の長さ）
- **目標空間計算量 (Target Space Complexity):** `O(N)`

---

### 入出力例
**例 1:**
- **入力:** `s = "aabccccaaa"`
- **出力:** `"a2b1c4a3"`
- **説明:** `'a'` が2つ、`'b'` が1つ、ネストされた `'c'` が4つ、最後に `'a'` が3つ連続するため、それぞれ結合されます。

**例 2:**
- **入力:** `s = "abca"`
- **出力:** `"a1b1c1a1"`

**例 3:**
- **入力:** `s = ""`
- **出力:** `""`
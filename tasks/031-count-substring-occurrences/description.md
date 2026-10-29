### 概要
与えられた文字列 `text` の中に、部分文字列 `sub` が何回含まれているかを数えて整数で返してください（※重なり合う場合もカウントに含めます）。

*(Given a string `text` and a substring `sub`, count and return the number of times `sub` appears in `text`, including overlapping occurrences.)*

---

### 制約
- `0 <= text.length <= 10⁴`
- `1 <= sub.length <= 10³`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N * M)` （ここで $N$ は `text` の長さ、$M$ は `sub` の長さ）
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `text = "abababa"`, `sub = "aba"`
- **出力:** `3`
- **説明:** `"aba"` はインデックス `0`、`2`、`4` から始まる位置に合計 `3` 回出現します。

**例 2:**
- **入力:** `text = "hello world"`, `sub = "l"`
- **出力:** `3`
- **説明:** 文字 `"l"` が文字列全体に `3` 回含まれています。

**例 3:**
- **入力:** `text = "aaaa"`, `sub = "aa"`
- **出力:** `3`
- **説明:** 重なりを許して数えるため、インデックス `0`、`1`、`2` から始まる `"aa"` がそれぞれカウントされ、合計 `3` 回になります。
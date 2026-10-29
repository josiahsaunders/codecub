### 概要
与えられた文字列 `text` の中から、ダブルクォーテーション (`"..."`) で囲まれた部分文字列をすべて抽出し、リスト形式で順番に返してください。

*(Given a string `text`, extract and return all substrings enclosed in double quotes (`"..."`) as a list in the order they appear.)*

---

### 制約
- `0 <= text.length <= 10⁴`
- クォーテーションは適切にペアで存在するものと仮定して構いません（ネストはないものとします）。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)` （ここで $N$ は `text` の長さ）
- **目標空間計算量 (Target Space Complexity):** `O(N)`

---

### 入出力例
**例 1:**
- **入力:** `text = "He said, \"Hello, world!\" and left."`
- **出力:** `["Hello, world!"]`
- **説明:** ダブルクォーテーションで囲まれた `"Hello, world!"` の中身が抽出されます。

**例 2:**
- **入力:** `text = "Item \"apple\", price \"100 yen\", and \"sale\""`
- **出力:** `["apple", "100 yen", "sale"]`
- **説明:** 複数のクォーテーションで囲まれた文字列が、出現順にリストとして返されます。

**例 3:**
- **入力:** `text = "No quotes here at all."`
- **出力:** `[]`
- **説明:** クォーテーションが含まれていないため、空のリストを返します。
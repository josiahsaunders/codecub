### 概要
与えられた文字列 `text` と整数 `shift` に対し、シーザー暗号 (Caesar cipher) を用いて文字列を暗号化する関数 `caesarCipher(text, shift)` を実装してください。

*(Given a string `text` and an integer `shift`, implement a function `caesarCipher(text, shift)` to encrypt the string using the Caesar cipher.)*

---

### 仕様
- 英大文字 (`A`-`Z`) および英小文字 (`a`-`z`) のみシフト処理を行います。
- アルファベットの大文字・小文字の区別を保持してください (例: `'a'` をシフトしても小文字のまま、`'A'` は大文字のまま)。
- アルファベットは循環します (例: `shift = 1` の場合、`'z'` は `'a'` に、`'Z'` は `'A'` に変換)。
- 数字、スペース、記号などのアルファベット以外の文字は変更せず、そのまま保持してください。
- `shift` には負の数や、26 以上の大きい数が与えられる場合もあります。

---

### 制約
- `0 <= len(text) <= 10⁵`
- `-10⁹ <= shift <= 10⁹`
- `text` には ASCII 文字が含まれます。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)` （$N$ は文字列の長さ）
- **目標空間計算量 (Target Space Complexity):** `O(N)`

---

### 入出力例
**例 1:**
- **入力:** `text = "abc"`, `shift = 3`
- **出力:** `"def"`

**例 2:**
- **入力:** `text = "Hello, World!"`, `shift = 5`
- **出力:** `"Mjqqt, Btwqi!"`
- **説明:** アルファベットのみが 5 文字シフトされ、記号やスペース、大文字小文字の区別は保持されます。

**例 3:**
- **入力:** `text = "xyz"`, `shift = 3`
- **出力:** `"abc"`
- **説明:** `'x' -> 'a'`, `'y' -> 'b'`, `'z' -> 'c'` のようにアルファベットが循環します。
### 概要
与えられたメッセージ文字列 `message` と禁止ワードのリスト `banned` に対し、メッセージ内に含まれる禁止ワードを同じ長さのアスタリスク `*` に置き換えた文字列を返してください。大文字・小文字は区別せず（ケースインセンシティブ）に一致するものとし、単語の一部として含まれる場合も置換対象とします。

*(Given a message string `message` and a list of banned words `banned`, replace all occurrences of the banned words in the message with asterisks `*` of the same length. The matching should be case-insensitive.)*

---

### 制約
- `1 <= message.length <= 10000`
- `0 <= banned.length <= 50`
- 禁止ワードが空の場合やメッセージ内に見つからない場合は、元のメッセージをそのまま返します。
- **補足 (Overlapping Rules):** ある禁止ワードが別の禁止ワードの一部（部分文字列）に含まれている場合（例: `"cat"` と `"caterpillar"`）、より長い禁止ワードが優先されます。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(M \cdot B \cdot L)` （$M$ はメッセージの長さ、$B$ は禁止ワードの数、$L$ はワードの最大長）
- **目標空間計算量 (Target Space Complexity):** `O(M)`

---

### 入出力例
**例 1:**
- **入力:** `message = "This is a bad word example"`, `banned = ["bad"]`
- **出力:** `"This is a *** word example"`
- **説明:** `"bad"` が `*` 3文字の `"***"` に置き換えられます。

**例 2:**
- **入力:** `message = "Hello HATE spam SPAM"`, `banned = ["hate", "spam"]`
- **出力:** `"Hello **** **** ****"`
- **説明:** 大文字・小文字を問わず、`"HATE"`、`"spam"`、`"SPAM"` がそれぞれの長さに応じた `*` に置換されます。

**例 3:**
- **入力:** `message = "Clean message here"`, `banned = ["bad", "evil"]`
- **出力:** `"Clean message here"`
- **説明:** 禁止ワードが含まれていないため、変更はありません。
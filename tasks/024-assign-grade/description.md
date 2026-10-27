### 概要
与えられた数値の成績 `score`（0〜100）に対して、以下の基準に従って対応する文字の成績（文字列）を返してください。

- **HD (High Distinction)**: `score >= 85`
- **D (Distinction)**: `75 <= score < 85`
- **C (Credit)**: `65 <= score < 75`
- **P (Pass)**: `50 <= score < 65`
- **CP (Conceded Pass)**: `45 <= score < 50`
- **F (Fail)**: `score < 45`

*(Given a numerical score `score` (0-100), return the corresponding letter grade as a string based on the grading boundaries.)*

---

### 制約
- `0 <= score <= 100`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(1)`
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `score = 88`
- **出力:** `"HD"`
- **説明:** `88` は `85` 以上であるため、成績は `"HD"` になります。

**例 2:**
- **入力:** `score = 72`
- **出力:** `"C"`
- **説明:** `72` は `65` 以上 `75` 未満の範囲に含まれるため、成績は `"C"` になります。

**例 3:**
- **入力:** `score = 42`
- **出力:** `"F"`
- **説明:** `42` は `45` 未満であるため、成績は `"F"` になります。
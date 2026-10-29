### 概要
開始年 `startYear` と終了年 `endYear`（両端を含む）が与えられたとき、その範囲内にあるすべてのうるう年（leap years）を昇順に並べたリストとして返してください。もし範囲内にうるう年がない場合は空のリスト `[]` を返してください。

うるう年の判定ルールは以下の通りです：
1. 4で割り切れる年はうるう年です。
2. ただし、100で割り切れる年は**うるう年ではありません**。
3. ただし、400で割り切れる年は**うるう年です**。

*(Given a starting year `startYear` and an ending year `endYear` (inclusive), return a list of all leap years within that range in ascending order. If there are no leap years in the range, return an empty array `[]`.)*

---

### 制約
- `1 <= startYear <= endYear <= 10⁴`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)` （ここで `N = endYear - startYear + 1`）
- **目標空間計算量 (Target Space Complexity):** `O(K)` （ここで `K` はうるう年の数）

---

### 入出力例
**例 1:**
- **入力:** `startYear = 2000`, `endYear = 2024`
- **出力:** `[2000, 2004, 2008, 2012, 2016, 2020, 2024]`
- **説明:** 2000年は400で割り切れるためうるう年です。その後4年ごとにうるう年が含まれます。

**例 2:**
- **入力:** `startYear = 1900`, `endYear = 1905`
- **出力:** `[1904]`
- **説明:** 1900年は100で割り切れますが400では割り切れないためうるう年ではありません。1904年が最初のエントリとなります。

**例 3:**
- **入力:** `startYear = 2021`, `endYear = 2023`
- **出力:** `[]`
- **説明:** この範囲内にはうるう年が存在しないため、空のリストを返します。
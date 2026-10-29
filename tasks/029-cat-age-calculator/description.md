### 概要
猫の年齢（年数） `catAge` が与えられたとき、以下の変換ルールに従って人間の換算年齢（整数）を計算し返してください。

- **1歳:** 15歳
- **2歳:** 24歳
- **3歳以上:** 2歳時の24歳を基準とし、2歳を超える1年につき **4年** を加算します（例：3歳は28歳、4歳は32歳、5歳は36歳…）。

*(Given a cat's age in years `catAge`, calculate and return its equivalent human age as an integer based on the conversion rules: 1st year = 15, 2nd year = 24, and each year after 2 adds 4 human years.)*

---

### 制約
- `1 <= catAge <= 30`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(1)`
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `catAge = 1`
- **出力:** `15`
- **説明:** 猫の1歳は人間の15歳に相当します。

**例 2:**
- **入力:** `catAge = 2`
- **出力:** `24`
- **説明:** 猫の2歳は人間の24歳に相当します。

**例 3:**
- **入力:** `catAge = 5`
- **出力:** `36`
- **説明:** 2歳時点の24歳に、3年分の追加（3 × 4 = 12）を足して `24 + 12 = 36歳` になります。
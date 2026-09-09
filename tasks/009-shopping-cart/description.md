### 概要
ショッピングカート内の商品の価格の配列 `prices` と、割引率 `discount` （パーセント表記の整数）が与えられます。

各商品に割引を適用した後の**合計金額**を計算し、整数（小数点以下切り捨て）で返してください。

計算ルール：
- 割引後の各商品価格 = `価格 * (1 - discount / 100)`
- すべての商品の割引後価格を合計した最終金額を返します。

*(Given an array of item prices `prices` and an integer `discount` percentage, calculate the total cost after applying the discount to each item. Return the final total as an integer rounded down.)*

---

### 制約
- `1 <= prices.length <= 10^4`
- `1 <= prices[i] <= 10^5`
- `0 <= discount <= 100`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** O(N)
- **目標空間計算量 (Target Space Complexity):** O(1)

---

### 入出力例
**例 1:**
- **入力:** `prices = [1000, 2000, 3000]`, `discount = 10`
- **出力:** `5400`
- **説明:** 10%引き後の価格はそれぞれ 900, 1800, 2700 となり、合計は 5400 です。

**例 2:**
- **入力:** `prices = [500, 1500]`, `discount = 0`
- **出力:** `2000`
- **説明:** 割引なし（0%）のため、合計は 2000 です。

**例 3:**
- **入力:** `prices = [299, 499]`, `discount = 20`
- **出力:** `638`
- **説明:** 20%引き後の合計は 638.4 となり、切り捨てて 638 を返します。
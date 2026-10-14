### 概要
与えられた日ごとの株価の配列 `prices` に対し、1回だけ株を買って売ることで得られる最大の利益を計算し、その利益を返してください。利益が出ない場合は `0` を返してください。なお、売却日は必ず購入日より後でなければなりません。

*(Given an array of daily stock prices `prices`, find the maximum profit you can achieve from a single buy and sell transaction. Return 0 if no profit can be made.)*

---

### 制約
- `1 <= prices.length <= 10⁵`
- `0 <= prices[i] <= 10⁴`

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)` （$N$ は配列の長さ）
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例
**例 1:**
- **入力:** `prices = [7, 1, 5, 3, 6, 4]`
- **出力:** `5`
- **説明:** 2日目（価格 = 1）に買い、5日目（価格 = 6）に売ると、利益 = 6 - 1 = 5 となります。（※ 6 - 1 = 5 が最大）

**例 2:**
- **入力:** `prices = [7, 6, 4, 3, 1]`
- **出力:** `0`
- **説明:** この場合、価格が下がり続けているため利益を得ることができません。よって 0 を返します。

**例 3:**
- **入力:** `prices = [2, 4, 1]`
- **出力:** `2`
- **説明:** 1日目（価格 = 2）に買い、2日目（価格 = 4）に売ると、利益 = 4 - 2 = 2 となります。
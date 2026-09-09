### 概要
摂氏温度（Celsius） `temp` と、変換先の単位を指定する文字列 `unit` （`"F"` または `"K"`）が与えられます。

指定された単位に応じて温度を変換し、小数第1位まで四捨五入（`round(val, 1)`）した結果を返してください。

変換ルール：
- **華氏（Fahrenheit / `"F"`）:** F = C * (9 / 5) + 32
- **絶対温度（Kelvin / `"K"`）:** K = C + 273.15

*(Given a float `temp` in Celsius and a string `unit` (`"F"` or `"K"`), convert the temperature to the target unit and return the result rounded to 1 decimal place.)*

---

### 制約
- `-273.15 <= temp <= 1000.0`
- `unit` は `"F"` または `"K"` のいずれかです。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** O(1)
- **目標空間計算量 (Target Space Complexity):** O(1)

---

### 入出力例
**例 1:**
- **入力:** `temp = 25.0`, `unit = "F"`
- **出力:** `77.0`
- **説明:** 25.0 * (9 / 5) + 32 = 77.0

**例 2:**
- **入力:** `temp = 0.0`, `unit = "K"`
- **出力:** `273.2`
- **説明:** 0.0 + 273.15 = 273.15 (四捨五入して 273.2)

**例 3:**
- **入力:** `temp = -40.0`, `unit = "F"`
- **出力:** `-40.0`
- **説明:** -40.0 * (9 / 5) + 32 = -40.0
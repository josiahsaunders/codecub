クレジットカード番号などの識別番号を検証するために広く使用されている **Luhnアルゴリズム（Modulo 10 アルゴリズム）** を実装してください。

入力として文字列 `card_number` が与えられます。この文字列が Luhnアルゴリズム に基づいて有効な番号である場合は `True` を、無効である場合は `False` を返してください。

---

*Implement the **Luhn Algorithm (Modulo 10 Algorithm)**, which is widely used to validate identification numbers such as credit card numbers.*

*Given an input string `card_number`, return `True` if it is a valid card number according to the Luhn algorithm, and `False` otherwise.*

---

### Luhnアルゴリズムの検証手順 / Algorithm Steps

1. **文字の削除 / Strip Non-Digits:**  
   数字以外の文字（スペースやハイフン `-` など）が含まれている場合は、それらを除外します。  
   *Strip out all non-digit characters (such as spaces or hyphens `-`).*

2. **桁の倍化 / Double Every Second Digit:**  
   数字のみになった文字列の **右端（末尾）から数えて2番目ごとの数字** を2倍にします。  
   *Starting from the **rightmost digit and moving left, double every second digit**.*

3. **2桁の減算処理 / Adjust Doubled Digits:**  
   2倍にした結果が 9 より大きい場合（例: 6 × 2 = 12）、その結果の各位の数字を足し合わせるか、9 を引きます（例: 12 → 1 + 2 = 3、または 12 - 9 = 3）。  
   *If doubling a digit results in a number greater than 9 (e.g., 6 × 2 = 12), sum its individual digits or subtract 9 (e.g., 12 → 1 + 2 = 3, or 12 - 9 = 3).*

4. **総和の計算 / Sum All Digits:**  
   すべての桁の数字（2倍にした数字と、操作を行わなかった数字の両方）を合計します。  
   *Sum all processed and unprocessed digits together.*

5. **有効性の判定 / Check Divisibility:**  
   合計値が **10 で割り切れる（合計 % 10 == 0）** 場合、その番号は有効です。  
   *If the total sum is **divisible by 10 (total % 10 == 0)**, the card number is valid.*

---

### 制約 / Constraints
- 入力文字列の長さ (`N`): `1 <= len(card_number) <= 10000`
- 除去後の有効な数字の桁数は 2 桁以上である必要があります（数字が 1 桁以下の場合は無効として `False` を返します）。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)` （`N` はカード番号の文字列長）
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 例 / Examples

#### 例 1 / Example 1
**入力 (Input):** `card_number = "79927398713"`  
**出力 (Output):** `True`  
**解説 (Explanation):**
1. 右から2番目ごとの数字を2倍にします:
   - `1` → `1 × 2 = 2`
   - `8` → `8 × 2 = 16` → `1 + 6 = 7` (または `16 - 9 = 7`)
   - `3` → `3 × 2 = 6`
   - `2` → `2 × 2 = 4`
   - `9` → `9 × 2 = 18` → `1 + 8 = 9`
2. すべての数字を合計します:
   - 変更した桁: `2 + 7 + 6 + 4 + 9 = 28`
   - 変更していない桁 (`3`, `7`, `9`, `7`, `9`, `7`): `3 + 7 + 9 + 7 + 9 + 7 = 42`
   - 総和: `28 + 42 = 70`
3. `70 % 10 == 0` のため、有効 (`True`) です。

#### 例 2 / Example 2
**入力 (Input):** `card_number = "4532-7520-1234-5673"`  
**出力 (Output):** `False`  
**解説 (Explanation):**
ハイフンを除外して数字のみに整形した後の合計値は `67` になります。`67 % 10 != 0` のため無効 (`False`) です。

#### 例 3 / Example 3
**入力 (Input):** `card_number = "4992 7398 716"`  
**出力 (Output):** `True`  
**解説 (Explanation):**
スペースを除外した番号の合計値は `70` となり、`70 % 10 == 0` を満たすため有効 (`True`) です。


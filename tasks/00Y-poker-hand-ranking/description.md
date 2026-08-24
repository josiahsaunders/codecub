5枚のカードで構成されたポーカーハンドのリスト `hands` が与えられます。最も強いポーカーハンドのインデックス（0-indexed）を返す関数 `find_winning_hand(hands)` を実装してください。

*(Given a list of poker hands `hands`, where each hand consists of 5 cards, implement the function `find_winning_hand(hands)` that returns the 0-based index of the strongest poker hand.)*

### カードと役の表現 / Card and Hand Representation
- **カード表記 (Card Notation):** ランク (`2`-`9`, `T`, `J`, `Q`, `K`, `A`) + スート (`S`, `H`, `D`, `C`) の2文字で表されます（例: `"AH"` = エースのハート, `"TD"` = 10のダイヤ）。
- **役の強さ順位 (Hand Rank Hierarchy - High to Low):**
  1. **ストレートフラッシュ (Straight Flush):** 同一スートで連続した5枚
  2. **フォー・オブ・ア・カインド (Four of a Kind):** 同じランクが4枚
  3. **フルハウス (Full House):** 同じランクが3枚 + 別の同じランクが2枚
  4. **フラッシュ (Flush):** 同一スートが5枚
  5. **ストレート (Straight):** 連続した5枚（エースは最高位 `T-J-Q-K-A` としても、最低位 `A-2-3-4-5` としても機能します）
  6. **スリー・オブ・ア・カインド (Three of a Kind):** 同じランクが3枚
  7. **ツーペア (Two Pair):** 同じランクのペアが2組
  8. **ワンペア (One Pair):** 同じランクのペアが1組
  9. **ハイカード (High Card):** 上記の役が成り立たない場合

### タイ（同点）の比較とキッカー / Tie-Breaking & Kickers
同じ役同士を比較する場合、役を構成するカードのランクが高い方を勝利とします。
同じ役でメインのランクも同じ場合、役に含まれない残りのカード（**キッカー / Kicker**）のランクを高い順に比較して勝敗を決定します。

最も強いハンドが複数存在し完全なタイとなる場合は、**最も小さいインデックス（最も前に出現するハンド）**を返してください。

*(When two hands have the same rank category, compare the ranks of the cards making up the combination. If those are equal, compare the remaining unused cards (**kickers**) in descending order to break the tie. If multiple hands share the exact highest strength, return the **smallest index**.)*

---

### 制約 / Constraints
- `1 <= N <= 10,000` (`N = len(hands)`)
- 各ハンドは厳密に 5 枚の文字列リストで構成されます。

---

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(N)`
- **目標空間計算量 (Target Space Complexity):** `O(1)`

---

### 入出力例 / Examples

#### 例 1 / Example 1
**入力 (Input):**
`hands = [["2H", "3H", "4H", "5H", "6H"], ["KS", "KH", "KD", "9H", "2C"]]`  
**出力 (Output):** `0`  
**解説 (Explanation):**  
インデックス 0 はストレートフラッシュ、インデックス 1 はスリー・オブ・ア・カインドです。ストレートフラッシュの方が強いため `0` を返します。

#### 例 2 / Example 2
**入力 (Input):**
`hands = [["AH", "KD", "QC", "JS", "9H"], ["AC", "KS", "QD", "JC", "8S"]]`  
**出力 (Output):** `0`  
**解説 (Explanation):**  
両者ともに役なし（ハイカード A-K-Q-J）ですが、5枚目のキッカーの比較で `9H` > `8S` となるため、インデックス `0` が勝利します。

#### 例 3 / Example 3
**入力 (Input):**
`hands = [["AH", "KH", "QH", "JH", "TH"], ["AS", "KS", "QS", "JS", "TS"]]`  
**出力 (Output):** `0`  
**解説 (Explanation):**  
両者ともに同等強さのロイヤルストレートフラッシュでタイです。規則に従い、最も小さいインデックスである `0` を返します。
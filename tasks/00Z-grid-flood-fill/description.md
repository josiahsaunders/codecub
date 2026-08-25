### 概要
2次元グリッド `image`（M X N）、開始位置の行インデックス `sr` と列インデックス `sc`、そして新しい色 `color` が与えられます。開始位置 `image[sr][sc]` と同じ色で上下左右（4方向）に連続して繋がっている領域を、すべて新しい色 `color` で塗りつぶしたグリッドを返す関数 `flood_fill(image, sr, sc, color)` を実装してください。

*(Given an M X N grid `image`, a starting cell at row `sr` and column `sc`, and a target `color`, perform a flood fill starting from `image[sr][sc]` and all 4-directionally connected cells of the same initial color. Return the modified grid.)*

### 制約
- `1 <= M, N <= 300` (`M = len(image)`, `N = len(image[0])`)
- `0 <= image[i][j], color <= 65535`
- `0 <= sr < M`
- `0 <= sc < N`

### 挑戦課題 (Challenge)
- **目標時間計算量 (Target Time Complexity):** `O(M * N)`
- **目標空間計算量 (Target Space Complexity):** `O(M * N)`

### 入出力例

**例 1:**
- **入力 (Input):**
  - `image`: `[[1, 1, 1], [1, 1, 0], [1, 0, 1]]`
    1 1 1
    1 1 0
    1 0 1
    
  - `sr = 1`, `sc = 1`, `color = 2`
- **出力 (Output):** `[[2, 2, 2], [2, 2, 0], [2, 0, 1]]`
  2 2 2
  2 2 0
  2 0 1
  
- **解説 (Explanation):**  
  位置 `(1, 1)` の色 `1` から開始し、繋がっている色 `1` の領域をすべて `2` に塗りつぶします。右下の `(2, 2)` は孤立した `1` のため影響を受けません。

**例 2:**
- **入力 (Input):**
  - `image`: `[[0, 0, 0], [0, 0, 0]]`
    0 0 0
    0 0 0
    
  - `sr = 0`, `sc = 0`, `color = 0`
- **出力 (Output):** `[[0, 0, 0], [0, 0, 0]]`
  0 0 0
  0 0 0
  

**例 3:**
- **入力 (Input):**
  - `image`: `[[5]]`
    5
    
  - `sr = 0`, `sc = 0`, `color = 9`
- **出力 (Output):** `[[9]]`
  9
  
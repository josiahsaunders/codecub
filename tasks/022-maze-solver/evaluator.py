from collections import deque
from evaluator_base import run_evaluator

def parse_io(in_text: str, out_text: str) -> tuple:
    # Parse maze lines from input text
    maze = [line.strip() for line in in_text.strip().splitlines() if line.strip()]
    return (maze,), maze

def runner(method, input_args: tuple, expected_maze: list[str]):
    maze = input_args[0]
    R, C = len(maze), len(maze[0])
    
    # Find start and end positions
    start, end = None, None
    for r in range(R):
        for c in range(C):
            if maze[r][c] == 'S':
                start = (r, c)
            elif maze[r][c] == 'E':
                end = (r, c)

    actual = method(maze)
    
    if not actual:
        return False, actual, "No path returned", len(maze) * len(maze[0])

    # Convert actual path to list of tuples for validation
    path = [tuple(pt) for pt in actual]

    # Validation checks:
    # 1. Must start at S and end at E
    if path[0] != start or path[-1] != end:
        return False, actual, "Path must start at 'S' and end at 'E'", len(path)

    # 2. Check validity of steps and walls
    seen = set()
    for i in range(len(path)):
        r, c = path[i]
        
        # Bounds check
        if not (0 <= r < R and 0 <= c < C):
            return False, actual, f"Coordinate {path[i]} is out of bounds", len(path)
            
        # Wall check
        if maze[r][c] == '#':
            return False, actual, f"Path hits a wall at {path[i]}", len(path)
            
        # Visited check (no loops in shortest path)
        if path[i] in seen:
            return False, actual, f"Path contains a loop at {path[i]}", len(path)
        seen.add(path[i])

        # Step adjacency check
        if i > 0:
            pr, pc = path[i-1]
            if abs(r - pr) + abs(c - pc) != 1:
                return False, actual, f"Invalid jump from {(pr, pc)} to {(r, c)}", len(path)

    # 3. Verify it is actually the *shortest* path by comparing length to a reference BFS
    def get_shortest_len():
        queue = deque([(start[0], start[1], 1)])
        visited = {start}
        while queue:
            r, c, dist = queue.popleft()
            if (r, c) == end:
                return dist
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and maze[nr][nc] != '#' and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append((nr, nc, dist + 1))
        return -1

    optimal_len = get_shortest_len()
    passed = len(path) == optimal_len

    return passed, actual, f"Expected length {optimal_len}, got {len(path)}", len(maze) * len(maze[0])

def evaluate_task(user_code_str, in_text, out_text, test_index):
    return run_evaluator(
        user_code_str, in_text, out_text, test_index,
        method_name="shortestPath",
        parse_fn=parse_io,
        runner_fn=runner
    )
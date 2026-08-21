import math

class ComplexityEstimator:
    def __init__(self):
        self.reset()

    def reset(self):
        self.time_points = []   # (N, avg_time_ms)
        self.memory_points = [] # (N, peak_mb)

    def add_measurement(self, n: int, time_ms: float, peak_mb: float = 0.0):
        if n > 0:
            if time_ms > 0.0:
                self.time_points.append((n, time_ms))
            if peak_mb >= 0.0:
                self.memory_points.append((n, peak_mb))

    def estimate_time(self) -> dict:
        if len(self.time_points) < 2:
            return {"complexity": "N/A", "reason": "Not enough data points"}

        unique_n = len({p[0] for p in self.time_points})
        if unique_n < 2:
            return {"complexity": "N/A", "reason": "Need varying input sizes"}

        k = self._calculate_log_exponent(self.time_points)

        # Threshold bands calibrated for N=100 up to N=10,000
        if k <= 0.30:
            complexity = "O(1)"
        elif k <= 0.70:
            complexity = "O(log N)"
        elif k <= 1.35:
            complexity = "O(N)"
        elif k <= 1.80:
            complexity = "O(N log N)"
        elif k <= 2.60:
            complexity = "O(N^2)"
        else:
            complexity = "O(N^3)"

        return {
            "complexity": complexity,
            "exponent_k": round(k, 2),
            "data_points": len(self.time_points)
        }

    def estimate_space(self) -> dict:
        if len(self.memory_points) < 2:
            return {"complexity": "O(1)", "exponent_k": 0.0, "data_points": len(self.memory_points)}

        unique_n = len({p[0] for p in self.memory_points})
        if unique_n < 2:
            return {"complexity": "O(1)", "exponent_k": 0.0, "data_points": len(self.memory_points)}

        mem_values = [p[1] for p in self.memory_points]
        max_mem = max(mem_values)
        min_mem = min(mem_values)

        # Auxiliary Space Guard:
        # If max peak allocation is <= 1 KB (0.001 MB) or max memory is within 2x of min memory,
        # it is strictly O(1) auxiliary space.
        if max_mem <= 0.001 or (min_mem > 0 and (max_mem / min_mem) < 2.0):
            return {
                "complexity": "O(1)",
                "exponent_k": 0.0,
                "data_points": len(self.memory_points)
            }

        k = self._calculate_log_exponent(self.memory_points)

        if k <= 0.35:
            complexity = "O(1)"
        elif k <= 1.40:
            complexity = "O(N)"
        else:
            complexity = "O(N^2)"

        return {
            "complexity": complexity,
            "exponent_k": round(k, 2),
            "data_points": len(self.memory_points)
        }

    def estimate(self) -> dict:
        return {
            "time": self.estimate_time(),
            "space": self.estimate_space()
        }

    def _calculate_log_exponent(self, points) -> float:
        valid_points = [(p[0], p[1]) for p in points if p[0] > 0 and p[1] > 0]
        if len(valid_points) < 2:
            return 0.0

        log_n = [math.log(p[0]) for p in valid_points]
        log_val = [math.log(p[1]) for p in valid_points]

        n_pts = len(valid_points)
        mean_x = sum(log_n) / n_pts
        mean_y = sum(log_val) / n_pts

        num = sum((log_n[i] - mean_x) * (log_val[i] - mean_y) for i in range(n_pts))
        den = sum((log_n[i] - mean_x) ** 2 for i in range(n_pts))

        return num / den if den != 0 else 0.0
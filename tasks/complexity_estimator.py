import math

class ComplexityEstimator:
    def __init__(self):
        self.time_points = []   # (N, time_ms)
        self.memory_points = [] # (N, peak_mb)

    def add_measurement(self, n: int, time_ms: float, peak_mb: float = 0.0):
        if n > 0:
            if time_ms > 0.005:  # Slightly lower threshold to capture fast Pyodide executions
                self.time_points.append((n, time_ms))
            if peak_mb > 0.001:
                self.memory_points.append((n, peak_mb))

    def estimate_time(self) -> dict:
        if len(self.time_points) < 2:
            return {"complexity": "N/A", "reason": "Not enough data points"}

        unique_n = len({p[0] for p in self.time_points})
        if unique_n < 2:
            return {"complexity": "N/A", "reason": "Need varying input sizes"}

        k = self._calculate_log_exponent(self.time_points)

        if k <= 0.25:
            complexity = "O(1)" if max(p[1] for p in self.time_points) < 0.5 else "O(log N)"
        elif k <= 1.25:
            complexity = "O(N)"
        elif k <= 1.75:
            complexity = "O(N log N)"
        elif k <= 2.5:
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
            return {"complexity": "N/A"}

        unique_n = len({p[0] for p in self.memory_points})
        if unique_n < 2:
            return {"complexity": "N/A"}

        # Calculate slope exponent k for memory
        k = self._calculate_log_exponent(self.memory_points)

        # Base input array loading scales linearly (k ≈ 1.0).
        # Auxiliary structures (hash maps, matrices) increase slope k.
        if k <= 1.10:
            complexity = "O(1)"  # Auxiliary O(1) space (growth matches input load only)
        elif k <= 1.80:
            complexity = "O(N)"  # Auxiliary O(N) space
        else:
            complexity = "O(N^2)" # Auxiliary O(N^2) space

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
        """Calculates power-law exponent k using log-log linear regression on given points."""
        if not points or len(points) < 2:
            return 0.0

        log_n = [math.log(p[0]) for p in points]
        log_val = [math.log(p[1]) for p in points]

        n_pts = len(points)
        mean_x = sum(log_n) / n_pts
        mean_y = sum(log_val) / n_pts

        num = sum((log_n[i] - mean_x) * (log_val[i] - mean_y) for i in range(n_pts))
        den = sum((log_n[i] - mean_x) ** 2 for i in range(n_pts))

        return num / den if den != 0 else 0.0
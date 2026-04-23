import random
import math
from typing import List, Dict, Any

from app.schemas.metric import KpiItem, TrendPoint, SparkPoint
from app.schemas.event import LiveCallStats


random.seed(42)


def generate_sparkline(n: int, base: float, variance: float, trend: float = 0.0) -> List[SparkPoint]:
    """生成迷你图数据，对齐前端 sparkline 函数."""
    points = []
    for i in range(n):
        v = max(
            0.0,
            base
            + math.sin(i / 2) * variance
            + (random.random() - 0.5) * variance
            + i * trend,
        )
        points.append(SparkPoint(i=i, v=round(v, 2)))
    return points


def compute_kpis(events: List[Dict[str, Any]], models: List[Dict[str, Any]], projects: List[Dict[str, Any]]) -> List[KpiItem]:
    """聚合计算 4 个 KPI."""
    total_calls = sum(p.get("calls", 0) for p in projects)
    total_cost = sum(p.get("cost", 0.0) for p in projects)

    # Token 估算（基于平均 tokens per call）
    avg_tokens_per_call = 600
    total_tokens = total_calls * avg_tokens_per_call

    # 加权成功率（基于 models 数据）
    if models:
        total_model_calls = sum(m.get("calls", 0) for m in models)
        model_success = (
            sum(m.get("success", 99.5) * m.get("calls", 0) for m in models) / total_model_calls
            if total_model_calls > 0
            else 99.81
        )
    else:
        model_success = 99.81

    return [
        KpiItem(
            id="calls",
            label="总调用次数",
            value=f"{total_calls:,}",
            delta="+12.4%",
            delta_positive=True,
            sub="对比最近 7 天",
            spark=generate_sparkline(28, 80, 18, 0.6),
            accent="primary",
        ),
        KpiItem(
            id="cost",
            label="本月支出",
            value=f"${total_cost:,.2f}",
            delta="−8.1%",
            delta_positive=True,
            sub="节省: $1.6k",
            spark=generate_sparkline(28, 60, 14, -0.3),
            accent="primary",
        ),
        KpiItem(
            id="tokens",
            label="已处理 Token",
            value=f"{total_tokens / 1e9:.2f} B",
            delta="+24.7%",
            delta_positive=True,
            sub="输入 / 输出: 62% / 38%",
            spark=generate_sparkline(28, 70, 22, 0.9),
            accent="primary",
        ),
        KpiItem(
            id="success",
            label="成功率",
            value=f"{model_success:.2f}%",
            delta="+0.12pp",
            delta_positive=True,
            sub="P95 延迟 842ms",
            spark=generate_sparkline(28, 90, 6, 0.05),
            accent="primary",
        ),
    ]


def generate_trend_data(period: str) -> List[TrendPoint]:
    """生成趋势时序数据，对齐前端 trendData."""
    period_map = {
        "7d": 336,     # 7 days * 48 half-hours
        "30d": 1440,   # 30 days * 48 half-hours
        "90d": 4320,   # 90 days * 48 half-hours
        "180d": 8640,  # 180 days * 48 half-hours
    }
    n = period_map.get(period, 336)

    points = []
    for i in range(n):
        t = i / max(1, n - 1)
        wave = math.sin(t * 6) * 18
        calls = round(120 + wave + random.random() * 30 + t * 80)
        cost = round(2.4 + wave * 0.04 + random.random() * 0.5 + t * 1.2, 2)
        latency = round(620 + random.random() * 220 - wave * 2)

        hour = (i // 2) % 24
        minute = "30" if i % 2 else "00"
        time_str = f"{hour:02d}:{minute}"

        points.append(
            TrendPoint(
                time=time_str,
                calls=calls,
                cost=cost,
                latency=latency,
            )
        )
    return points


def compute_live_stats(events: List[Dict[str, Any]]) -> LiveCallStats:
    """计算实时统计."""
    if not events:
        return LiveCallStats(qps=0.0, success_rate=0.0, avg_latency=0.0, total_today=0)

    recent = events[-20:] if len(events) >= 20 else events
    success_count = sum(1 for e in recent if e.get("status") == 200)
    success_rate = (success_count / len(recent)) * 100 if recent else 0.0

    avg_latency = sum(e.get("latency_ms", 0) for e in recent) / len(recent) if recent else 0.0

    # 放大到合理量级
    total_today = len(events) * 5000

    # QPS 估算（假设 10 秒窗口）
    qps = round(len(recent) / 10.0, 1)

    return LiveCallStats(
        qps=qps,
        success_rate=round(success_rate, 2),
        avg_latency=round(avg_latency, 1),
        total_today=total_today,
    )

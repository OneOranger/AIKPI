import math
from typing import Any

from fastapi import APIRouter

from app.schemas.value import (
    Decision,
    RoiTrendPoint,
    ValueAssessment,
    ValueBreakdown,
    ValueByProject,
    ValueDelta,
    ValueHeadline,
)

router = APIRouter(prefix="/api/v1/value", tags=["价值评估"])


# ---------- 静态数据（对齐前端 mockData.ts） ----------

_VALUE_HEADLINE = ValueHeadline(
    roi=318,
    monthly_savings=84200,
    payback_days=27,
    confidence=0.94,
)

_DELTAS = [
    ValueDelta(
        key="time",
        label="Time per task",
        baseline=14.2,
        post_ai=1.8,
        unit="min",
        better="low",
        narrative="平均任务在 2 分钟内完成 — 从 15 分钟大幅下降。",
    ),
    ValueDelta(
        key="cost",
        label="Cost per task",
        baseline=6.40,
        post_ai=0.72,
        unit="$",
        better="low",
        narrative="混合成本（人工 + 基础设施）下降约 89%。",
    ),
    ValueDelta(
        key="errorRate",
        label="Error rate",
        baseline=7.8,
        post_ai=1.4,
        unit="%",
        better="low",
        narrative="所有团队 QA 重开率趋于零。",
    ),
    ValueDelta(
        key="throughput",
        label="Tasks / day",
        baseline=320,
        post_ai=1840,
        unit="",
        better="high",
        narrative="相同人手，5.7 倍的吞吐量。",
    ),
    ValueDelta(
        key="csat",
        label="CSAT",
        baseline=3.6,
        post_ai=4.6,
        unit="/5",
        better="high",
        narrative="客户满意度提升一整分 — NPS +28。",
    ),
    ValueDelta(
        key="firstResponse",
        label="First response",
        baseline=312,
        post_ai=24,
        unit="s",
        better="low",
        narrative="从 5 分钟降至 30 秒以下。",
    ),
]

_MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]

_ROI_TREND = [
    RoiTrendPoint(
        month=_MONTHS[i],
        value=round(22000 + i * 9500 + math.sin(i / 2) * 4000),
        cost=round(8000 + i * 1100 + math.cos(i / 3) * 600),
        net=round(
            (22000 + i * 9500 + math.sin(i / 2) * 4000)
            - (8000 + i * 1100 + math.cos(i / 3) * 600)
        ),
    )
    for i in range(12)
]

_VALUE_BREAKDOWN = [
    ValueBreakdown(source="节省人力成本", amount=48200, share=57),
    ValueBreakdown(source="加快交付周期 → 收入提升", amount=19800, share=24),
    ValueBreakdown(source="减少错误 → 减少返工", amount=9100, share=11),
    ValueBreakdown(source="提升 CSAT → 留存提升", amount=7100, share=8),
]

_BY_PROJECT = [
    ValueByProject(
        project="客服机器人", hours_saved=1840, cost_saved=28400, roi=412, status="扩展中"
    ),
    ValueByProject(
        project="营销引擎", hours_saved=980, cost_saved=19200, roi=286, status="扩展中"
    ),
    ValueByProject(
        project="RAG 检索", hours_saved=720, cost_saved=14600, roi=198, status="稳定"
    ),
    ValueByProject(
        project="销售副驾驶", hours_saved=540, cost_saved=12800, roi=174, status="稳定"
    ),
    ValueByProject(
        project="内部 HR 机器人", hours_saved=290, cost_saved=6400, roi=88, status="待审查"
    ),
    ValueByProject(
        project="代码审查助手", hours_saved=410, cost_saved=9200, roi=142, status="稳定"
    ),
]

_DECISIONS = [
    Decision(
        level="expand",
        title="将客服机器人扩展至所有区域",
        detail="ROI 412% · 若推广至亚太 + 拉丁美洲，预计每月增加 $38k。",
    ),
    Decision(
        level="optimize",
        title="将营销引擎迁移至 DeepSeek V3.2",
        detail="质量持平，Token 成本降低 28% · 预计每月节省 $4.6k。",
    ),
    Decision(
        level="review",
        title="重新评估内部 HR 机器人",
        detail="ROI 88%（低于 150% 阈值） · 上周准确率降至 78%。",
    ),
]


# ---------- 路由 ----------


@router.get("/assessment", response_model=ValueAssessment)
async def get_value_assessment() -> ValueAssessment:
    """返回完整价值评估数据."""
    return ValueAssessment(
        period="最近 90 天",
        project="所有项目 · 加权汇总",
        headline=_VALUE_HEADLINE,
        deltas=_DELTAS,
        roi_trend=_ROI_TREND,
        value_breakdown=_VALUE_BREAKDOWN,
        by_project=_BY_PROJECT,
        decisions=_DECISIONS,
    )


@router.get("/decisions", response_model=list[Decision])
async def get_decisions() -> list[Decision]:
    """返回决策建议列表."""
    return _DECISIONS

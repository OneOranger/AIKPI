from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ValueHeadline(BaseModel):
    """价值评估 headline."""

    model_config = ConfigDict(populate_by_name=True)

    roi: int
    monthly_savings: int = Field(alias="monthlySavings")
    payback_days: int = Field(alias="paybackDays")
    confidence: float


class ValueDelta(BaseModel):
    """前后对比 delta 卡片."""

    model_config = ConfigDict(populate_by_name=True)

    key: str
    label: str
    baseline: float
    post_ai: float = Field(alias="postAi")
    unit: str
    better: str
    narrative: str


class RoiTrendPoint(BaseModel):
    """ROI 月度趋势点."""

    model_config = ConfigDict(populate_by_name=True)

    month: str
    value: int
    cost: int
    net: int


class ValueBreakdown(BaseModel):
    """价值来源分布."""

    model_config = ConfigDict(populate_by_name=True)

    source: str
    amount: int
    share: int


class ValueByProject(BaseModel):
    """按项目价值统计."""

    model_config = ConfigDict(populate_by_name=True)

    project: str
    hours_saved: int = Field(alias="hoursSaved")
    cost_saved: int = Field(alias="costSaved")
    roi: int
    status: str


class Decision(BaseModel):
    """决策建议."""

    model_config = ConfigDict(populate_by_name=True)

    level: str
    title: str
    detail: str


class ValueAssessment(BaseModel):
    """完整价值评估响应."""

    model_config = ConfigDict(populate_by_name=True)

    period: str
    project: str
    headline: ValueHeadline
    deltas: List[ValueDelta] = Field(default_factory=list)
    roi_trend: List[RoiTrendPoint] = Field(default_factory=list, alias="roiTrend")
    value_breakdown: List[ValueBreakdown] = Field(default_factory=list, alias="valueBreakdown")
    by_project: List[ValueByProject] = Field(default_factory=list, alias="byProject")
    decisions: List[Decision] = Field(default_factory=list)

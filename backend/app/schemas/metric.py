from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import SparkPoint


class KpiItem(BaseModel):
    """KPI 指标项."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    label: str
    value: str
    delta: str
    delta_positive: bool = Field(alias="deltaPositive")
    sub: str
    spark: List[SparkPoint] = Field(default_factory=list)
    accent: str = "primary"


class TrendPoint(BaseModel):
    """趋势数据点."""

    model_config = ConfigDict(populate_by_name=True)

    time: str
    calls: int
    cost: float
    latency: int


class ModelSummary(BaseModel):
    """模型概览（对齐前端 models 列表）."""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    calls: int
    cost: float
    share: int
    color: str
    success: float
    latency: int


class ModelCompareDetail(BaseModel):
    """完整模型对比数据（对齐前端 ModelCompare）."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    vendor: str
    badge: str
    context: str
    input_cost: float = Field(alias="inputCost")
    output_cost: float = Field(alias="outputCost")
    blended_cost: float = Field(alias="blendedCost")
    accuracy: float
    hallucination: float
    reasoning: int
    coding: int
    multilingual: int
    latency_p50: int = Field(alias="latencyP50")
    latency_p95: int = Field(alias="latencyP95")
    throughput: int
    uptime: float
    value_index: int = Field(alias="valueIndex")
    spark: List[SparkPoint] = Field(default_factory=list)


class TaskMatrixRow(BaseModel):
    """任务矩阵单行（按任务类型的模型得分）."""

    model_config = ConfigDict(populate_by_name=True)

    task: str
    gpt5: int
    claude45: int
    gemini25: int
    deepseek: int


class ModelTrendPoint(BaseModel):
    """模型趋势数据点（按天统计各模型准确率）."""

    model_config = ConfigDict(populate_by_name=True)

    day: str
    gpt5: float
    claude45: float
    gemini25: float
    deepseek: float


class ProjectMetric(BaseModel):
    """项目维度统计."""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    env: str
    calls: int
    cost: float
    roi: int
    status: str
    trend: str


class MetricsOverview(BaseModel):
    """指标总览."""

    model_config = ConfigDict(populate_by_name=True)

    kpis: List[KpiItem] = Field(default_factory=list)
    active_projects: int = Field(default=0, alias="activeProjects")
    active_models: int = Field(default=0, alias="activeModels")
    uptime: float = 99.9


class MetricsTrends(BaseModel):
    """趋势指标."""

    model_config = ConfigDict(populate_by_name=True)

    data: List[TrendPoint] = Field(default_factory=list)
    period: str = "24h"


class MetricsModels(BaseModel):
    """模型对比指标."""

    model_config = ConfigDict(populate_by_name=True)

    models: List[ModelCompareDetail] = Field(default_factory=list)
    task_matrix: List[TaskMatrixRow] = Field(default_factory=list, alias="taskMatrix")
    trend: List[ModelTrendPoint] = Field(default_factory=list)


class MetricsProjects(BaseModel):
    """项目维度指标."""

    model_config = ConfigDict(populate_by_name=True)

    projects: List[ProjectMetric] = Field(default_factory=list)

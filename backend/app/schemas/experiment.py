from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field


class Experiment(BaseModel):
    """实验（对齐 experiments.json）."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    project: str
    status: str
    model: str
    variant_a: str = Field(alias="variantA")
    variant_b: str = Field(alias="variantB")
    metrics: Dict[str, Any] = Field(default_factory=dict)
    traffic_split: float = Field(alias="trafficSplit")
    samples: int
    created_at: datetime = Field(alias="createdAt")
    created_by: str = Field(alias="createdBy")
    # 扩展字段（对齐任务要求的统计字段）
    type: Optional[str] = None
    control_group: Optional[str] = Field(default=None, alias="controlGroup")
    experiment_group: Optional[str] = Field(default=None, alias="experimentGroup")
    accuracy_diff: Optional[float] = Field(default=None, alias="accuracyDiff")
    cost_diff: Optional[float] = Field(default=None, alias="costDiff")
    start_date: Optional[datetime] = Field(default=None, alias="startDate")
    end_date: Optional[datetime] = Field(default=None, alias="endDate")
    p_value: Optional[float] = Field(default=None, alias="pValue")
    significant: Optional[bool] = None


class ExperimentCreate(BaseModel):
    """创建实验请求."""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    project: str
    model: str
    variant_a: str = Field(alias="variantA")
    variant_b: str = Field(alias="variantB")
    traffic_split: float = Field(alias="trafficSplit")
    type: Optional[str] = None


class ExperimentResult(BaseModel):
    """实验结果."""

    model_config = ConfigDict(populate_by_name=True)

    experiment_id: str = Field(alias="experimentId")
    samples: int
    accuracy_a: Optional[float] = Field(default=None, alias="accuracyA")
    accuracy_b: Optional[float] = Field(default=None, alias="accuracyB")
    accuracy_diff: Optional[float] = Field(default=None, alias="accuracyDiff")
    cost_a: Optional[float] = Field(default=None, alias="costA")
    cost_b: Optional[float] = Field(default=None, alias="costB")
    cost_diff: Optional[float] = Field(default=None, alias="costDiff")
    p_value: Optional[float] = Field(default=None, alias="pValue")
    significant: Optional[bool] = None
    winner: Optional[str] = None

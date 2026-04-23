from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import SparkPoint


class EventTrack(BaseModel):
    """单个事件上报请求体."""

    model_config = ConfigDict(populate_by_name=True)

    model: str
    project: str
    input_tokens: int = Field(alias="inputTokens")
    output_tokens: int = Field(alias="outputTokens")
    latency_ms: int = Field(alias="latencyMs")
    status: int
    accuracy: Optional[float] = None
    user_id: Optional[str] = Field(default=None, alias="userId")


class EventBatch(BaseModel):
    """批量上报请求体."""

    model_config = ConfigDict(populate_by_name=True)

    events: List[EventTrack] = Field(default_factory=list)


class EventRecord(BaseModel):
    """完整事件记录."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    project: str
    model: str
    input_tokens: int = Field(alias="inputTokens")
    output_tokens: int = Field(alias="outputTokens")
    total_tokens: int = Field(alias="totalTokens")
    latency_ms: int = Field(alias="latencyMs")
    cost: float
    status: int
    timestamp: datetime


class LiveCallStats(BaseModel):
    """实时统计."""

    model_config = ConfigDict(populate_by_name=True)

    qps: float = 0.0
    success_rate: float = Field(default=0.0, alias="successRate")
    avg_latency: float = Field(default=0.0, alias="avgLatency")
    total_today: int = Field(default=0, alias="totalToday")


class LiveCallItem(BaseModel):
    """实时调用列表项（对齐前端 liveCalls）."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    project: str
    model: str
    tokens: int
    latency: int
    cost: float
    status: int
    time: str

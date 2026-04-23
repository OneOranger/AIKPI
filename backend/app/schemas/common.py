from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field


class SparkPoint(BaseModel):
    """Sparkline 数据点."""

    model_config = ConfigDict(populate_by_name=True)

    i: int
    v: float


class ApiResponse(BaseModel):
    """通用响应包装."""

    model_config = ConfigDict(populate_by_name=True)

    success: bool = True
    data: Any = None
    message: str = ""


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """分页响应."""

    model_config = ConfigDict(populate_by_name=True)

    items: List[T] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
    pages: int = 0


class TimeRange(str, Enum):
    """时间范围枚举."""

    TODAY = "today"
    YESTERDAY = "yesterday"
    LAST_7_DAYS = "last_7_days"
    LAST_30_DAYS = "last_30_days"
    LAST_90_DAYS = "last_90_days"
    CUSTOM = "custom"


class TimeRangeQuery(BaseModel):
    """时间范围查询参数."""

    model_config = ConfigDict(populate_by_name=True)

    time_range: Optional[TimeRange] = TimeRange.LAST_7_DAYS
    start: Optional[datetime] = None
    end: Optional[datetime] = None

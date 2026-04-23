from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class AlertRule(BaseModel):
    """告警规则."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    description: Optional[str] = None
    level: str = Field(alias="severity")
    metric: str
    operator: str = Field(alias="condition")
    threshold: float
    project: str = "all"
    enabled: bool = True
    cooldown_minutes: int = Field(default=30, alias="cooldownMinutes")
    created_at: Optional[datetime] = Field(default=None, alias="createdAt")
    channels: Optional[List[str]] = Field(default_factory=list)


class AlertRuleCreate(BaseModel):
    """创建告警规则请求."""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    description: Optional[str] = None
    level: str = Field(alias="severity")
    metric: str
    operator: str = Field(alias="condition")
    threshold: float
    project: str = "all"
    enabled: bool = True
    cooldown_minutes: int = Field(default=30, alias="cooldownMinutes")
    channels: Optional[List[str]] = Field(default_factory=list)


class AlertHistory(BaseModel):
    """告警历史记录."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    rule_id: str = Field(alias="ruleId")
    rule_name: Optional[str] = Field(default=None, alias="ruleName")
    level: str = Field(alias="severity")
    title: str
    project: str
    detail: Optional[str] = None
    resolved: bool = False
    status: Optional[str] = None
    triggered_at: datetime = Field(alias="triggeredAt")
    resolved_at: Optional[datetime] = Field(default=None, alias="resolvedAt")
    duration: Optional[int] = None
    current_value: Optional[float] = Field(default=None, alias="currentValue")
    threshold: Optional[float] = None


class ActiveAlert(BaseModel):
    """活跃告警（对齐前端 alerts）."""

    model_config = ConfigDict(populate_by_name=True)

    level: str
    title: str
    time: str
    project: str

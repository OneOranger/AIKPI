from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class PlatformInfo(BaseModel):
    """平台信息."""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    version: str
    language: str
    timezone: str


class DefaultSettings(BaseModel):
    """默认设置."""

    model_config = ConfigDict(populate_by_name=True)

    currency: str = "USD"
    cost_threshold_alert: float = Field(default=5000.0, alias="costThresholdAlert")
    accuracy_threshold_warning: float = Field(default=90.0, alias="accuracyThresholdWarning")
    accuracy_threshold_critical: float = Field(default=85.0, alias="accuracyThresholdCritical")
    latency_threshold_ms: int = Field(default=2000, alias="latencyThresholdMs")
    default_model: str = Field(default="gpt5", alias="defaultModel")


class DataRetention(BaseModel):
    """数据保留策略."""

    model_config = ConfigDict(populate_by_name=True)

    events_days: int = Field(default=90, alias="eventsDays")
    alerts_days: int = Field(default=365, alias="alertsDays")
    experiments_days: int = Field(default=180, alias="experimentsDays")


class FeatureFlags(BaseModel):
    """功能开关."""

    model_config = ConfigDict(populate_by_name=True)

    auto_routing: bool = Field(default=True, alias="autoRouting")
    llm_judge: bool = Field(default=True, alias="llmJudge")
    ab_testing: bool = Field(default=True, alias="abTesting")
    cost_optimization: bool = Field(default=True, alias="costOptimization")
    real_time_monitoring: bool = Field(default=True, alias="realTimeMonitoring")


class Integrations(BaseModel):
    """第三方集成."""

    model_config = ConfigDict(populate_by_name=True)

    slack_webhook: str = Field(default="", alias="slackWebhook")
    email_notifications: bool = Field(default=True, alias="emailNotifications")
    webhook_url: str = Field(default="", alias="webhookUrl")


class SystemSettings(BaseModel):
    """系统设置."""

    model_config = ConfigDict(populate_by_name=True)

    platform: PlatformInfo
    defaults: DefaultSettings
    data_retention: DataRetention = Field(alias="dataRetention")
    features: FeatureFlags
    integrations: Integrations


class UserInfo(BaseModel):
    """用户信息."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    email: str
    role: str
    avatar: str
    status: str
    last_login: Optional[datetime] = Field(default=None, alias="lastLogin")
    created_at: Optional[datetime] = Field(default=None, alias="createdAt")


class ApiKeyInfo(BaseModel):
    """API Key 信息."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    provider: str
    key_prefix: str = Field(alias="keyPrefix")
    status: str
    rate_limit: str = Field(alias="rateLimit")
    monthly_budget: float = Field(alias="monthlyBudget")
    current_usage: float = Field(alias="currentUsage")
    project: Optional[str] = None
    created_at: Optional[datetime] = Field(default=None, alias="createdAt")
    last_used: Optional[datetime] = Field(default=None, alias="lastUsed")


class ModelConfig(BaseModel):
    """模型配置（对齐 models.json）."""

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
    calls: int
    cost: float
    share: int
    success: float


class NotificationChannel(BaseModel):
    """通知渠道."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    type: str
    config: dict = Field(default_factory=dict)
    enabled: bool = True

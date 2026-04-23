from __future__ import annotations

from app.schemas.common import (
    ApiResponse,
    PaginatedResponse,
    SparkPoint,
    TimeRange,
    TimeRangeQuery,
)
from app.schemas.event import (
    EventBatch,
    EventRecord,
    EventTrack,
    LiveCallItem,
    LiveCallStats,
)
from app.schemas.metric import (
    KpiItem,
    MetricsModels,
    MetricsOverview,
    MetricsProjects,
    MetricsTrends,
    ModelCompareDetail,
    ModelSummary,
    ModelTrendPoint,
    ProjectMetric,
    TaskMatrixRow,
    TrendPoint,
)
from app.schemas.quality import (
    AccuracyByTask,
    ConsistencyScore,
    ErrorType,
    FeedbackStats,
    JudgeScore,
    QualityDashboard,
    QualityOverview,
    QualityTrendPoint,
    RecallAtK,
    RetrievalMetrics,
)
from app.schemas.value import (
    Decision,
    RoiTrendPoint,
    ValueAssessment,
    ValueBreakdown,
    ValueByProject,
    ValueDelta,
    ValueHeadline,
)
from app.schemas.alert import (
    ActiveAlert,
    AlertHistory,
    AlertRule,
    AlertRuleCreate,
)
from app.schemas.experiment import (
    Experiment,
    ExperimentCreate,
    ExperimentResult,
)
from app.schemas.settings import (
    ApiKeyInfo,
    DataRetention,
    DefaultSettings,
    FeatureFlags,
    Integrations,
    ModelConfig,
    NotificationChannel,
    PlatformInfo,
    SystemSettings,
    UserInfo,
)

__all__ = [
    # common
    "SparkPoint",
    "ApiResponse",
    "PaginatedResponse",
    "TimeRange",
    "TimeRangeQuery",
    # event
    "EventTrack",
    "EventBatch",
    "EventRecord",
    "LiveCallStats",
    "LiveCallItem",
    # metric
    "KpiItem",
    "TrendPoint",
    "ModelSummary",
    "ModelCompareDetail",
    "TaskMatrixRow",
    "ModelTrendPoint",
    "ProjectMetric",
    "MetricsOverview",
    "MetricsTrends",
    "MetricsModels",
    "MetricsProjects",
    # quality
    "QualityOverview",
    "AccuracyByTask",
    "RetrievalMetrics",
    "RecallAtK",
    "JudgeScore",
    "ConsistencyScore",
    "ErrorType",
    "FeedbackStats",
    "QualityTrendPoint",
    "QualityDashboard",
    # value
    "ValueHeadline",
    "ValueDelta",
    "RoiTrendPoint",
    "ValueBreakdown",
    "ValueByProject",
    "Decision",
    "ValueAssessment",
    # alert
    "AlertRule",
    "AlertRuleCreate",
    "AlertHistory",
    "ActiveAlert",
    # experiment
    "Experiment",
    "ExperimentCreate",
    "ExperimentResult",
    # settings
    "SystemSettings",
    "PlatformInfo",
    "DefaultSettings",
    "DataRetention",
    "FeatureFlags",
    "Integrations",
    "UserInfo",
    "ApiKeyInfo",
    "ModelConfig",
    "NotificationChannel",
]

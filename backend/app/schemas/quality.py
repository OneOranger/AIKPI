from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class QualityOverview(BaseModel):
    """质量概览（对齐前端 qualityHeadline）."""

    model_config = ConfigDict(populate_by_name=True)

    overall_accuracy: float = Field(alias="overallAccuracy")
    accuracy_delta: float = Field(alias="accuracyDelta")
    hallucination_rate: float = Field(alias="hallucinationRate")
    hallucination_delta: float = Field(alias="hallucinationDelta")
    task_completion: float = Field(alias="taskCompletion")
    task_completion_delta: float = Field(alias="taskCompletionDelta")
    csat: float
    csat_delta: float = Field(alias="csatDelta")
    evaluated_samples: int = Field(alias="evaluatedSamples")
    judge_model: str = Field(alias="judgeModel")


class AccuracyByTask(BaseModel):
    """按任务准确率."""

    model_config = ConfigDict(populate_by_name=True)

    task: str
    accuracy: float
    samples: int
    trend: str


class RecallAtK(BaseModel):
    """召回率 @K."""

    model_config = ConfigDict(populate_by_name=True)

    k: str
    recall: float


class RetrievalMetrics(BaseModel):
    """RAG 检索指标."""

    model_config = ConfigDict(populate_by_name=True)

    recall_at_k: List[RecallAtK] = Field(default_factory=list, alias="recallAtK")
    precision: float
    f1: float
    mrr: float
    chunk_hit_rate: float = Field(alias="chunkHitRate")


class JudgeScore(BaseModel):
    """LLM 评分."""

    model_config = ConfigDict(populate_by_name=True)

    metric: str
    score: float
    prev: float


class ConsistencyScore(BaseModel):
    """一致性分数."""

    model_config = ConfigDict(populate_by_name=True)

    project: str
    score: float
    runs: int


class ErrorType(BaseModel):
    """错误类型分布."""

    model_config = ConfigDict(populate_by_name=True)

    type: str
    share: int
    count: int
    trend: int


class RatingDistribution(BaseModel):
    """评分分布."""

    model_config = ConfigDict(populate_by_name=True)

    stars: int
    count: int


class FeedbackStats(BaseModel):
    """用户反馈统计."""

    model_config = ConfigDict(populate_by_name=True)

    thumbs_up: int = Field(alias="thumbsUp")
    thumbs_down: int = Field(alias="thumbsDown")
    nps: int
    nps_delta: int = Field(alias="npsDelta")
    ratings_avg: float = Field(alias="ratingsAvg")
    ratings_total: int = Field(alias="ratingsTotal")
    distribution: List[RatingDistribution] = Field(default_factory=list)


class QualityTrendPoint(BaseModel):
    """质量趋势数据点."""

    model_config = ConfigDict(populate_by_name=True)

    day: str
    accuracy: float
    hallucination: float


class QualityDashboard(BaseModel):
    """质量仪表盘完整数据."""

    model_config = ConfigDict(populate_by_name=True)

    overview: QualityOverview
    accuracy_by_task: List[AccuracyByTask] = Field(default_factory=list, alias="accuracyByTask")
    retrieval: RetrievalMetrics
    judge_scores: List[JudgeScore] = Field(default_factory=list, alias="judgeScores")
    consistency: List[ConsistencyScore] = Field(default_factory=list)
    error_types: List[ErrorType] = Field(default_factory=list, alias="errorTypes")
    feedback: FeedbackStats
    trend: List[QualityTrendPoint] = Field(default_factory=list)

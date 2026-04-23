import math
import random
from typing import Any

from fastapi import APIRouter

from app.schemas.quality import (
    AccuracyByTask,
    ConsistencyScore,
    ErrorType,
    FeedbackStats,
    JudgeScore,
    QualityOverview,
    QualityTrendPoint,
    RatingDistribution,
    RecallAtK,
    RetrievalMetrics,
)

router = APIRouter(prefix="/api/v1/quality", tags=["质量评估"])


# ---------- 静态数据（对齐前端 mockData.ts） ----------

_QUALITY_HEADLINE = QualityOverview(
    overall_accuracy=93.4,
    accuracy_delta=1.8,
    hallucination_rate=1.6,
    hallucination_delta=-0.4,
    task_completion=88.2,
    task_completion_delta=2.1,
    csat=4.5,
    csat_delta=0.2,
    evaluated_samples=48210,
    judge_model="Claude 4.5 (LLM-as-judge)",
)

_ACCURACY_BY_TASK = [
    AccuracyByTask(task="分类", accuracy=96.2, samples=9820, trend="up"),
    AccuracyByTask(task="生成", accuracy=91.4, samples=12480, trend="up"),
    AccuracyByTask(task="抽取", accuracy=94.8, samples=8120, trend="flat"),
    AccuracyByTask(task="摘要", accuracy=89.6, samples=6240, trend="up"),
    AccuracyByTask(task="翻译", accuracy=92.1, samples=4180, trend="down"),
    AccuracyByTask(task="代码生成", accuracy=90.7, samples=7370, trend="up"),
]

_RETRIEVAL_METRICS = RetrievalMetrics(
    recall_at_k=[
        RecallAtK(k="@1", recall=62.4),
        RecallAtK(k="@3", recall=81.2),
        RecallAtK(k="@5", recall=89.6),
        RecallAtK(k="@10", recall=94.8),
        RecallAtK(k="@20", recall=97.3),
    ],
    precision=87.2,
    f1=88.4,
    mrr=0.812,
    chunk_hit_rate=91.4,
)

_JUDGE_SCORES = [
    JudgeScore(metric="相关性", score=4.6, prev=4.4),
    JudgeScore(metric="连贯性", score=4.5, prev=4.4),
    JudgeScore(metric="流畅性", score=4.7, prev=4.6),
    JudgeScore(metric="忠实度", score=4.3, prev=4.1),
    JudgeScore(metric="有用性", score=4.4, prev=4.2),
    JudgeScore(metric="安全性", score=4.8, prev=4.7),
]

_CONSISTENCY_SCORES = [
    ConsistencyScore(project="客服机器人", score=0.94, runs=5),
    ConsistencyScore(project="RAG 检索", score=0.89, runs=5),
    ConsistencyScore(project="营销引擎", score=0.78, runs=5),
    ConsistencyScore(project="代码审查助手", score=0.91, runs=5),
    ConsistencyScore(project="销售副驾驶", score=0.86, runs=5),
]

_ERROR_TYPES = [
    ErrorType(type="格式错误", share=32, count=612, trend=-8),
    ErrorType(type="事实错误", share=24, count=458, trend=-3),
    ErrorType(type="逻辑错误", share=18, count=344, trend=2),
    ErrorType(type="幻觉", share=12, count=229, trend=-5),
    ErrorType(type="偏题", share=8, count=153, trend=1),
    ErrorType(type="安全违规", share=4, count=76, trend=-2),
    ErrorType(type="其他", share=2, count=38, trend=0),
]

_FEEDBACK_STATS = FeedbackStats(
    thumbs_up=8420,
    thumbs_down=612,
    nps=58,
    nps_delta=6,
    ratings_avg=4.5,
    ratings_total=9032,
    distribution=[
        RatingDistribution(stars=5, count=5240),
        RatingDistribution(stars=4, count=2680),
        RatingDistribution(stars=3, count=740),
        RatingDistribution(stars=2, count=240),
        RatingDistribution(stars=1, count=132),
    ],
)


def _generate_quality_trend() -> list[QualityTrendPoint]:
    """生成 30 天质量趋势（对齐前端算法）."""
    return [
        QualityTrendPoint(
            day=f"D{i + 1}",
            accuracy=round(91.5 + math.sin(i / 4) * 1.6 + random.random() * 0.6, 2),
            hallucination=round(
                2.4 + math.cos(i / 5) * 0.6 - i * 0.02 + random.random() * 0.2, 2
            ),
        )
        for i in range(30)
    ]


# ---------- 路由 ----------


@router.get("/overview")
async def get_quality_overview() -> dict[str, Any]:
    """返回质量指标概览."""
    return {
        "headline": _QUALITY_HEADLINE.model_dump(by_alias=True),
        "qualityTrend": [p.model_dump(by_alias=True) for p in _generate_quality_trend()],
        "judgeScores": [s.model_dump(by_alias=True) for s in _JUDGE_SCORES],
        "consistencyScores": [s.model_dump(by_alias=True) for s in _CONSISTENCY_SCORES],
        "errorTypes": [e.model_dump(by_alias=True) for e in _ERROR_TYPES],
        "feedbackStats": _FEEDBACK_STATS.model_dump(by_alias=True),
    }


@router.get("/accuracy", response_model=list[AccuracyByTask])
async def get_accuracy_by_task() -> list[AccuracyByTask]:
    """返回按任务类型的准确率列表."""
    return _ACCURACY_BY_TASK


@router.get("/retrieval", response_model=RetrievalMetrics)
async def get_retrieval_metrics() -> RetrievalMetrics:
    """返回 RAG 检索质量指标."""
    return _RETRIEVAL_METRICS

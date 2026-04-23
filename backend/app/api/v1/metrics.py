import random
import math

from fastapi import APIRouter

from app.core.storage import JsonStorage
from app.core.config import settings
from app.schemas.metric import ModelCompareDetail
from app.schemas.common import ApiResponse
from app.services.metric_service import compute_kpis, generate_sparkline, generate_trend_data

router = APIRouter(prefix="/api/v1/metrics", tags=["指标查询"])

storage = JsonStorage(settings.data_dir)


@router.get("/overview", response_model=ApiResponse)
async def get_overview():
    events = storage.read("events.json")
    models = storage.read("models.json")
    projects = storage.read("projects.json")

    kpis = compute_kpis(events, models, projects)
    active_projects = len([p for p in projects if p.get("status") in ("健康", "警告", "预发布")])
    active_models = len(models)

    return ApiResponse(
        success=True,
        data={
            "kpis": [kpi.model_dump(by_alias=True) for kpi in kpis],
            "activeProjects": active_projects,
            "activeModels": active_models,
            "uptime": "99.99%",
        },
    )


@router.get("/trends", response_model=ApiResponse)
async def get_trends(period: str = "7d"):
    data = generate_trend_data(period)
    return ApiResponse(
        success=True,
        data={
            "data": [point.model_dump(by_alias=True) for point in data],
            "period": period,
        },
    )


@router.get("/models", response_model=ApiResponse)
async def get_models():
    models_raw = storage.read("models.json")

    models = []
    for m in models_raw:
        spark = generate_sparkline(14, m.get("accuracy", 90) - 2, 2, 0.15)
        detail = ModelCompareDetail(
            id=m.get("id", ""),
            name=m.get("name", ""),
            vendor=m.get("vendor", ""),
            badge=m.get("badge", ""),
            context=m.get("context", ""),
            input_cost=m.get("input_cost", 0.0),
            output_cost=m.get("output_cost", 0.0),
            blended_cost=m.get("blended_cost", 0.0),
            accuracy=m.get("accuracy", 0.0),
            hallucination=m.get("hallucination", 0.0),
            reasoning=m.get("reasoning", 0),
            coding=m.get("coding", 0),
            multilingual=m.get("multilingual", 0),
            latency_p50=m.get("latency_p50", 0),
            latency_p95=m.get("latency_p95", 0),
            throughput=m.get("throughput", 0),
            uptime=m.get("uptime", 0.0),
            value_index=m.get("value_index", 0),
            spark=spark,
        )
        models.append(detail.model_dump(by_alias=True))

    task_matrix = [
        {"task": "客服支持", "gpt5": 92, "claude45": 95, "gemini25": 90, "deepseek": 87},
        {"task": "代码生成", "gpt5": 94, "claude45": 96, "gemini25": 89, "deepseek": 91},
        {"task": "RAG / 检索", "gpt5": 93, "claude45": 94, "gemini25": 92, "deepseek": 86},
        {"task": "长上下文摘要", "gpt5": 90, "claude45": 92, "gemini25": 96, "deepseek": 82},
        {"task": "多语言", "gpt5": 92, "claude45": 89, "gemini25": 95, "deepseek": 84},
        {"task": "结构化抽取", "gpt5": 95, "claude45": 94, "gemini25": 91, "deepseek": 89},
        {"task": "创意写作", "gpt5": 93, "claude45": 95, "gemini25": 88, "deepseek": 85},
    ]

    random.seed(42)
    model_trend = []
    for i in range(30):
        model_trend.append({
            "day": f"D{i + 1}",
            "gpt5": round(94 + math.sin(i / 3) * 0.6 + random.random() * 0.4, 2),
            "claude45": round(93.5 + math.sin(i / 4) * 0.5 + random.random() * 0.4, 2),
            "gemini25": round(91 + math.sin(i / 2.5) * 0.7 + random.random() * 0.4, 2),
            "deepseek": round(88 + math.sin(i / 3.5) * 0.8 + random.random() * 0.5, 2),
        })

    prompt_versions = [
        {
            "version": "V1",
            "label": "基线",
            "author": "alice",
            "updated": "2026-02-14",
            "description": "原始零样本 Prompt，仅包含最少指令。",
            "accuracy": 86.4,
            "tokensIn": 412,
            "tokensOut": 318,
            "costPer1k": 0.0061,
            "latency": 1180,
            "helpfulRate": 78.2,
            "samples": 4820,
        },
        {
            "version": "V2",
            "label": "少样本示例",
            "author": "alice",
            "updated": "2026-03-09",
            "description": "添加 3 个上下文示例 + 结构化输出模式。",
            "accuracy": 92.1,
            "tokensIn": 684,
            "tokensOut": 246,
            "costPer1k": 0.0072,
            "latency": 1320,
            "helpfulRate": 86.5,
            "samples": 5104,
        },
        {
            "version": "V3",
            "label": "思维链 + 压缩模式",
            "author": "marc",
            "updated": "2026-04-11",
            "description": "思维链推理，压缩模式，缓存友好的系统 Prompt。",
            "accuracy": 94.7,
            "tokensIn": 358,
            "tokensOut": 198,
            "costPer1k": 0.0048,
            "latency": 980,
            "helpfulRate": 91.3,
            "samples": 5388,
        },
    ]

    return ApiResponse(
        success=True,
        data={
            "models": models,
            "taskMatrix": task_matrix,
            "trend": model_trend,
            "promptVersions": prompt_versions,
        },
    )


@router.get("/projects", response_model=ApiResponse)
async def get_projects():
    projects_raw = storage.read("projects.json")

    projects = []
    for p in projects_raw:
        projects.append({
            "name": p.get("name", ""),
            "env": p.get("env", ""),
            "calls": p.get("calls", 0),
            "cost": p.get("cost", 0.0),
            "roi": p.get("roi", 0),
            "status": p.get("status", ""),
            "trend": p.get("trend", ""),
        })

    return ApiResponse(success=True, data={"projects": projects})

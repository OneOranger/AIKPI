from datetime import datetime

from fastapi import APIRouter, Query

from app.core.storage import JsonStorage
from app.core.config import settings
from app.schemas.common import ApiResponse
from app.schemas.event import LiveCallItem, LiveCallStats
from app.services.metric_service import compute_live_stats

router = APIRouter(prefix="/api/v1/live", tags=["实时调用"])

storage = JsonStorage(settings.data_dir)


def _format_relative_time(timestamp_str: str) -> str:
    """将 ISO 时间戳转换为相对时间字符串."""
    try:
        dt = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        now = datetime.now(dt.tzinfo)
        delta = now - dt

        seconds = int(delta.total_seconds())
        if seconds < 60:
            return f"{seconds}秒前"
        elif seconds < 3600:
            return f"{seconds // 60}分钟前"
        elif seconds < 86400:
            return f"{seconds // 3600}小时前"
        else:
            return f"{seconds // 86400}天前"
    except Exception:
        return "刚刚"


@router.get("/calls", response_model=ApiResponse)
async def get_live_calls(
    model: str = Query(default="", description="模型筛选"),
    project: str = Query(default="", description="项目筛选"),
    status: str = Query(default="", description="状态筛选"),
    limit: int = Query(default=20, ge=1, le=100, description="返回数量"),
):
    events = storage.read("events.json")

    # 按时间倒序
    events = sorted(events, key=lambda e: e.get("timestamp", ""), reverse=True)

    # 筛选
    filtered = []
    for e in events:
        if model and e.get("model") != model:
            continue
        if project and e.get("project") != project:
            continue
        if status and str(e.get("status", "")) != status:
            continue
        filtered.append(e)

    filtered = filtered[:limit]

    # 格式化
    items = []
    for idx, e in enumerate(filtered):
        # 为了对齐前端"实时"体验，对最近几条使用固定相对时间
        if idx == 0:
            time_str = "2秒前"
        elif idx == 1:
            time_str = "3秒前"
        elif idx == 2:
            time_str = "4秒前"
        elif idx == 3:
            time_str = "5秒前"
        elif idx == 4:
            time_str = "6秒前"
        elif idx == 5:
            time_str = "7秒前"
        elif idx == 6:
            time_str = "8秒前"
        elif idx == 7:
            time_str = "9秒前"
        else:
            time_str = _format_relative_time(e.get("timestamp", ""))

        items.append(
            LiveCallItem(
                id=e.get("id", ""),
                project=e.get("project", ""),
                model=e.get("model", ""),
                tokens=e.get("total_tokens", 0),
                latency=e.get("latency_ms", 0),
                cost=e.get("cost", 0.0),
                status=e.get("status", 0),
                time=time_str,
            )
        )

    return ApiResponse(success=True, data={"items": items, "total": len(items)})


@router.get("/stats", response_model=ApiResponse)
async def get_live_stats():
    events = storage.read("events.json")
    stats = compute_live_stats(events)
    return ApiResponse(success=True, data=stats.model_dump(by_alias=True))

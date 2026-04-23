import secrets
from datetime import datetime, timezone

from app.core.config import settings
from app.core.storage import JsonStorage
from app.schemas.event import EventRecord, EventTrack

storage = JsonStorage(settings.data_dir)


def _generate_event_id() -> str:
    return "evt_" + secrets.token_hex(4)


def get_model_cost(model_name: str) -> tuple[float, float]:
    """从 models.json 获取模型费率 (input_cost, output_cost)。"""
    models = storage.read("models.json")
    if not isinstance(models, list):
        return (0.0, 0.0)

    # 精确匹配
    for model in models:
        if model.get("name") == model_name:
            return (
                float(model.get("input_cost", 0.0)),
                float(model.get("output_cost", 0.0)),
            )

    # 部分匹配：model_name 包含在 models.json 的 name 中
    # 或 models.json 的 name 包含 model_name
    for model in models:
        db_name = model.get("name", "")
        if model_name in db_name or db_name in model_name:
            return (
                float(model.get("input_cost", 0.0)),
                float(model.get("output_cost", 0.0)),
            )

    return (0.0, 0.0)


def process_event(event: EventTrack) -> EventRecord:
    """处理单个事件：生成 ID、计算成本、添加时间戳。"""
    input_cost, output_cost = get_model_cost(event.model)
    total_tokens = event.input_tokens + event.output_tokens
    cost = (event.input_tokens * input_cost + event.output_tokens * output_cost) / 1_000_000

    return EventRecord(
        id=_generate_event_id(),
        project=event.project,
        model=event.model,
        input_tokens=event.input_tokens,
        output_tokens=event.output_tokens,
        total_tokens=total_tokens,
        latency_ms=event.latency_ms,
        cost=round(cost, 6),
        status=event.status,
        timestamp=datetime.now(timezone.utc),
    )

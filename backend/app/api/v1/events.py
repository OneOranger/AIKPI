from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.api.v1.auth import get_api_key
from app.core.config import settings
from app.core.storage import JsonStorage
from app.schemas.common import ApiResponse
from app.schemas.event import EventBatch, EventRecord, EventTrack
from app.services.event_service import process_event

router = APIRouter(prefix="/api/v1/events", tags=["事件"])
storage = JsonStorage(settings.data_dir)


@router.post("/track", response_model=ApiResponse)
async def track_event(
    event: EventTrack,
    api_key: dict = Depends(get_api_key),
):
    """接收单个事件上报，处理后存入 events.json。"""
    record = process_event(event)
    record_dict = record.model_dump(by_alias=True)
    # 将 datetime 序列化为 ISO 格式字符串
    if hasattr(record_dict.get("timestamp"), "isoformat"):
        record_dict["timestamp"] = record_dict["timestamp"].isoformat().replace("+00:00", "Z")
    storage.append("events.json", record_dict)
    return ApiResponse(
        success=True,
        data=record_dict,
        message="Event tracked successfully",
    )


@router.post("/batch", response_model=ApiResponse)
async def track_batch(
    batch: EventBatch,
    api_key: dict = Depends(get_api_key),
):
    """接收批量事件上报，逐一处理后存入 events.json。"""
    records: List[dict] = []
    for event in batch.events:
        record = process_event(event)
        record_dict = record.model_dump(by_alias=True)
        if hasattr(record_dict.get("timestamp"), "isoformat"):
            record_dict["timestamp"] = record_dict["timestamp"].isoformat().replace("+00:00", "Z")
        records.append(record_dict)
        storage.append("events.json", record_dict)

    return ApiResponse(
        success=True,
        data={"count": len(records), "events": records},
        message=f"{len(records)} events tracked successfully",
    )


@router.get("/{event_id}", response_model=ApiResponse)
async def get_event(
    event_id: str,
    api_key: dict = Depends(get_api_key),
):
    """从 events.json 查找指定事件。"""
    event = storage.find_by_id("events.json", event_id)
    if not event:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
    return ApiResponse(
        success=True,
        data=event,
        message="Event found",
    )

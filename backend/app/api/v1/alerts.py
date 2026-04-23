from datetime import datetime
from typing import List, Optional
import secrets

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from app.core.config import settings
from app.core.storage import JsonStorage
from app.schemas.alert import AlertRule, AlertRuleCreate, AlertHistory, ActiveAlert

router = APIRouter(prefix="/api/v1/alerts", tags=["告警管理"])
storage = JsonStorage(settings.data_dir)


class AlertRuleUpdate(BaseModel):
    """更新告警规则请求."""

    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = Field(default=None, alias="severity")
    metric: Optional[str] = None
    operator: Optional[str] = Field(default=None, alias="condition")
    threshold: Optional[float] = None
    project: Optional[str] = None
    enabled: Optional[bool] = None
    cooldown_minutes: Optional[int] = Field(default=None, alias="cooldownMinutes")
    channels: Optional[List[str]] = None


def _generate_rule_id() -> str:
    return f"rule_{secrets.token_hex(3)}"


@router.get("/rules", response_model=List[AlertRule])
async def get_alert_rules():
    data = storage.read("alerts_rules.json")
    return data


@router.post("/rules", response_model=AlertRule)
async def create_alert_rule(rule: AlertRuleCreate):
    new_rule = AlertRule(
        id=_generate_rule_id(),
        name=rule.name,
        description=rule.description,
        level=rule.level,
        metric=rule.metric,
        operator=rule.operator,
        threshold=rule.threshold,
        project=rule.project,
        enabled=rule.enabled,
        cooldown_minutes=rule.cooldown_minutes,
        created_at=datetime.utcnow(),
        channels=rule.channels,
    )
    storage.append("alerts_rules.json", new_rule.model_dump(mode="json"))
    return new_rule


@router.put("/rules/{rule_id}", response_model=AlertRule)
async def update_alert_rule(rule_id: str, updates: AlertRuleUpdate):
    update_dict = {
        k: v
        for k, v in updates.model_dump(by_alias=False, exclude_none=True).items()
        if v is not None
    }
    if not update_dict:
        raise HTTPException(status_code=400, detail="无更新内容")
    if not storage.update_by_id("alerts_rules.json", rule_id, update_dict):
        raise HTTPException(status_code=404, detail="规则不存在")
    updated = storage.find_by_id("alerts_rules.json", rule_id)
    return AlertRule(**updated)


@router.get("/history", response_model=List[AlertHistory])
async def get_alert_history():
    data = storage.read("alerts_history.json")
    result = []
    for item in data:
        item_copy = dict(item)
        if not item_copy.get("status"):
            item_copy["status"] = "已恢复" if item_copy.get("resolved") else "触发中"
        result.append(item_copy)
    return result


@router.get("/active", response_model=List[ActiveAlert])
async def get_active_alerts():
    data = storage.read("alerts_history.json")
    active = []
    for item in data:
        if not item.get("resolved", False):
            active.append(
                ActiveAlert(
                    level=item.get("level", "warning"),
                    title=item.get("title", ""),
                    time=item.get("triggered_at", ""),
                    project=item.get("project", ""),
                )
            )
    return active

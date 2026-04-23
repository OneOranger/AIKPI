import secrets
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from app.core.config import settings
from app.core.storage import JsonStorage
from app.schemas.common import ApiResponse

router = APIRouter(prefix="/api/v1/auth", tags=["认证"])
storage = JsonStorage(settings.data_dir)


def _generate_api_key() -> str:
    return "ak_" + secrets.token_hex(16)


def _generate_key_id() -> str:
    return "key_" + secrets.token_hex(4)


def get_api_key(x_api_key: str = Header(..., alias="X-API-Key")) -> dict:
    """从请求头提取并验证 API Key。"""
    keys = storage.read("api_keys.json")
    if not isinstance(keys, list):
        raise HTTPException(status_code=401, detail="Invalid API Key")

    for key_item in keys:
        if key_item.get("key") == x_api_key:
            if key_item.get("status") != "active":
                raise HTTPException(status_code=403, detail="API Key is not active")
            return key_item

    raise HTTPException(status_code=401, detail="Invalid API Key")


class ApiKeyCreate(BaseModel):
    """创建 API Key 请求体。"""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    provider: str = "openai"
    project: Optional[str] = Field(default=None, alias="project")
    rate_limit: Optional[str] = Field(default="10000 RPM", alias="rateLimit")
    monthly_budget: Optional[float] = Field(default=10000.0, alias="monthlyBudget")


class ApiKeyInfo(BaseModel):
    """API Key 信息响应。"""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    key: str
    provider: str
    project: Optional[str] = None
    status: str
    created_at: str = Field(alias="createdAt")


@router.get("/verify", response_model=ApiResponse)
async def verify_key(api_key: dict = Depends(get_api_key)):
    """验证请求头中的 X-API-Key 是否有效。"""
    return ApiResponse(
        success=True,
        data={
            "id": api_key.get("id"),
            "name": api_key.get("name"),
            "provider": api_key.get("provider"),
            "project": api_key.get("project"),
            "status": api_key.get("status"),
            "rate_limit": api_key.get("rate_limit"),
            "monthly_budget": api_key.get("monthly_budget"),
            "current_usage": api_key.get("current_usage", 0),
        },
        message="API Key is valid",
    )


@router.post("/keys", response_model=ApiResponse)
async def create_key(body: ApiKeyCreate):
    """生成新 API Key。"""
    new_key = _generate_api_key()
    key_item = {
        "id": _generate_key_id(),
        "name": body.name,
        "key": new_key,
        "provider": body.provider,
        "key_prefix": new_key[:8] + "****" + new_key[-4:],
        "status": "active",
        "rate_limit": body.rate_limit,
        "monthly_budget": body.monthly_budget,
        "current_usage": 0.0,
        "project": body.project,
        "created_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "last_used": None,
    }
    storage.append("api_keys.json", key_item)
    return ApiResponse(
        success=True,
        data=ApiKeyInfo(
            id=key_item["id"],
            name=key_item["name"],
            key=new_key,
            provider=key_item["provider"],
            project=key_item["project"],
            status=key_item["status"],
            created_at=key_item["created_at"],
        ).model_dump(by_alias=True),
        message="API Key created successfully",
    )

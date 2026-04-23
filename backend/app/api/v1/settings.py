from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict

from app.core.config import settings
from app.core.storage import JsonStorage
from app.schemas.settings import SystemSettings, UserInfo, ModelConfig, ApiKeyInfo

router = APIRouter(prefix="/api/v1/settings", tags=["系统设置"])
storage = JsonStorage(settings.data_dir)


class UserCreate(BaseModel):
    """创建用户请求."""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    email: str
    role: str
    avatar: str
    status: str = "active"


def _generate_user_id() -> str:
    import secrets

    return f"user_{secrets.token_hex(3)}"


def _deep_merge(base: dict, updates: dict) -> dict:
    for key, value in updates.items():
        if isinstance(value, dict) and key in base and isinstance(base[key], dict):
            base[key] = _deep_merge(base[key], value)
        else:
            base[key] = value
    return base


@router.get("", response_model=SystemSettings)
async def get_settings():
    data = storage.read("settings.json")
    return data


@router.put("")
async def update_settings(updates: dict):
    current = storage.read("settings.json")
    if not isinstance(current, dict):
        current = {}
    merged = _deep_merge(current, updates)
    storage.write("settings.json", merged)
    return {"success": True, "data": merged}


@router.get("/users", response_model=List[UserInfo])
async def get_users():
    data = storage.read("users.json")
    return data


@router.post("/users", response_model=UserInfo)
async def create_user(user: UserCreate):
    new_user = UserInfo(
        id=_generate_user_id(),
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=user.avatar,
        status=user.status,
        created_at=datetime.utcnow(),
    )
    storage.append("users.json", new_user.model_dump(mode="json"))
    return new_user


@router.get("/models", response_model=List[ModelConfig])
async def get_models():
    data = storage.read("models.json")
    return data


@router.get("/api-keys", response_model=List[ApiKeyInfo])
async def get_api_keys():
    data = storage.read("api_keys.json")
    return data

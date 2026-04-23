from datetime import datetime
from typing import List, Optional
import secrets

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field

from app.core.config import settings
from app.core.storage import JsonStorage
from app.schemas.experiment import Experiment, ExperimentCreate, ExperimentResult

router = APIRouter(prefix="/api/v1/experiments", tags=["实验管理"])
storage = JsonStorage(settings.data_dir)


class ExperimentUpdate(BaseModel):
    """更新实验请求."""

    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = None
    project: Optional[str] = None
    status: Optional[str] = None
    model: Optional[str] = None
    variant_a: Optional[str] = Field(default=None, alias="variantA")
    variant_b: Optional[str] = Field(default=None, alias="variantB")
    traffic_split: Optional[float] = Field(default=None, alias="trafficSplit")
    type: Optional[str] = None


def _generate_experiment_id() -> str:
    return f"exp_{secrets.token_hex(3)}"


@router.get("", response_model=List[Experiment])
async def get_experiments(status: Optional[str] = Query(None, description="按状态筛选")):
    data = storage.read("experiments.json")
    if status:
        data = [item for item in data if item.get("status") == status]
    return data


@router.post("", response_model=Experiment)
async def create_experiment(exp: ExperimentCreate):
    new_exp = Experiment(
        id=_generate_experiment_id(),
        name=exp.name,
        project=exp.project,
        status="scheduled",
        model=exp.model,
        variant_a=exp.variant_a,
        variant_b=exp.variant_b,
        metrics={},
        traffic_split=exp.traffic_split,
        samples=0,
        created_at=datetime.utcnow(),
        created_by="system",
        type=exp.type,
    )
    storage.append("experiments.json", new_exp.model_dump(mode="json"))
    return new_exp


@router.put("/{experiment_id}", response_model=Experiment)
async def update_experiment(experiment_id: str, updates: ExperimentUpdate):
    update_dict = {
        k: v
        for k, v in updates.model_dump(by_alias=False, exclude_none=True).items()
        if v is not None
    }
    if not update_dict:
        raise HTTPException(status_code=400, detail="无更新内容")
    if not storage.update_by_id("experiments.json", experiment_id, update_dict):
        raise HTTPException(status_code=404, detail="实验不存在")
    updated = storage.find_by_id("experiments.json", experiment_id)
    return Experiment(**updated)


@router.get("/{experiment_id}/results", response_model=ExperimentResult)
async def get_experiment_results(experiment_id: str):
    exp = storage.find_by_id("experiments.json", experiment_id)
    if not exp:
        raise HTTPException(status_code=404, detail="实验不存在")

    metrics = exp.get("metrics", {})

    accuracy_diff = metrics.get("accuracy_diff")
    if accuracy_diff is None and "accuracy_a" in metrics and "accuracy_b" in metrics:
        accuracy_diff = round(metrics["accuracy_b"] - metrics["accuracy_a"], 2)

    cost_diff = metrics.get("cost_diff")
    if cost_diff is None and "cost_a" in metrics and "cost_b" in metrics:
        cost_diff = round(metrics["cost_a"] - metrics["cost_b"], 4)

    result = ExperimentResult(
        experiment_id=experiment_id,
        samples=exp.get("samples", 0),
        accuracy_a=metrics.get("accuracy_a"),
        accuracy_b=metrics.get("accuracy_b"),
        accuracy_diff=accuracy_diff,
        cost_a=metrics.get("cost_a"),
        cost_b=metrics.get("cost_b"),
        cost_diff=cost_diff,
        p_value=metrics.get("p_value"),
        significant=metrics.get("significant"),
        winner=metrics.get("winner"),
    )
    return result

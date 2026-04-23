from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.events import router as events_router
from app.api.v1.quality import router as quality_router
from app.api.v1.value import router as value_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.experiments import router as experiments_router
from app.api.v1.settings import router as settings_router
from app.api.v1.metrics import router as metrics_router
from app.api.v1.live_calls import router as live_router

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS - 允许前端跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 路由注册
app.include_router(auth_router)
app.include_router(events_router)
app.include_router(quality_router)
app.include_router(value_router)
app.include_router(alerts_router)
app.include_router(experiments_router)
app.include_router(settings_router)
app.include_router(metrics_router)
app.include_router(live_router)


@app.get("/")
async def root():
    return {"name": settings.app_name, "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "ok"}

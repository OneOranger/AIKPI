from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = "AI KPI Platform"
    api_v1_prefix: str = "/api/v1"
    debug: bool = True
    data_dir: Path = Path(__file__).parent.parent.parent / "data"
    log_level: str = "INFO"

    # Database
    database_url: str = "sqlite+aiosqlite:///./data/ai_kpi.db"

    # AI Gateway
    default_model_provider: str = "openai"
    default_model_name: str = "gpt-3.5-turbo"
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"

    class Config:
        env_file = ".env"


settings = Settings()

import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Resolve path to ai-service/.env explicitly
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Hospital AI Microservice"
    API_V1_STR: str = "/api/v1"
    SUPABASE_URL: str = "https://qimgihrwuqliwoafpzkc.supabase.co"
    SUPABASE_KEY: str = "sb_publishable_hGC-OIeKEbGx91cpLmRk7Q_QnhzLckR"
    GEMINI_API_KEY: str = ""
    DOTNET_HOSPITAL_BACKEND_URL: str = "http://localhost:5000"
    INTERNAL_SECRET_KEY: str = "hospital-secure-internal-key"

    class Config:
        env_file = str(ENV_PATH)
        extra = "allow"

settings = Settings()

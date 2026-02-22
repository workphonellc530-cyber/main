from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "AgentForge AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/agentforge"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/agentforge"
    REDIS_URL: str = "redis://localhost:6379/0"

    SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-64"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    STRIPE_PRICE_STARTER: Optional[str] = None
    STRIPE_PRICE_GROWTH: Optional[str] = None
    STRIPE_PRICE_ENTERPRISE: Optional[str] = None

    CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://agentforge.ai"]

    SENTRY_DSN: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: str = "agentforge-assets"

    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: str = "noreply@agentforge.ai"

    RATE_LIMIT_PER_MINUTE: int = 60
    MAX_AGENTS_STARTER: int = 3
    MAX_AGENTS_GROWTH: int = 25
    MAX_AGENTS_ENTERPRISE: int = 999
    MAX_MESSAGES_STARTER: int = 10000
    MAX_MESSAGES_GROWTH: int = 100000
    MAX_MESSAGES_ENTERPRISE: int = 10000000

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

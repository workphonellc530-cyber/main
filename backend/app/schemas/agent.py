from pydantic import BaseModel, ConfigDict
from typing import Optional, Any
from datetime import datetime
from uuid import UUID


class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    agent_type: str
    llm_provider: str = "openai"
    llm_model: str = "gpt-4o"
    temperature: float = 0.7
    max_tokens: int = 4096
    system_prompt: Optional[str] = None
    tools_config: list[dict[str, Any]] = []
    webhook_url: Optional[str] = None
    allowed_domains: list[str] = []
    widget_config: dict[str, Any] = {}


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    llm_provider: Optional[str] = None
    llm_model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    system_prompt: Optional[str] = None
    tools_config: Optional[list[dict[str, Any]]] = None
    webhook_url: Optional[str] = None
    allowed_domains: Optional[list[str]] = None
    widget_config: Optional[dict[str, Any]] = None


class AgentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    owner_id: UUID
    name: str
    description: Optional[str]
    agent_type: str
    status: str
    llm_provider: str
    llm_model: str
    temperature: float
    max_tokens: int
    system_prompt: Optional[str]
    tools_config: list[dict[str, Any]]
    embed_token: Optional[str]
    total_conversations: int
    total_messages: int
    avg_satisfaction: float
    resolution_rate: float
    created_at: datetime
    updated_at: datetime


class AgentListResponse(BaseModel):
    agents: list[AgentResponse]
    total: int


class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None
    visitor_id: Optional[str] = None
    metadata: dict[str, Any] = {}


class ChatResponse(BaseModel):
    conversation_id: UUID
    message_id: UUID
    response: str
    tokens_used: int
    latency_ms: int


class ConversationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    agent_id: UUID
    status: str
    channel: str
    message_count: int
    satisfaction_score: Optional[int]
    resolved: bool
    started_at: datetime
    ended_at: Optional[datetime]

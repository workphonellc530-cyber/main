import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum, Text, Integer, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class AgentType(str, enum.Enum):
    CUSTOMER_SUPPORT = "customer_support"
    LEAD_GENERATION = "lead_generation"
    CONTENT_CREATOR = "content_creator"
    DATA_ANALYST = "data_analyst"
    SALES_ASSISTANT = "sales_assistant"
    CODE_REVIEWER = "code_reviewer"
    EMAIL_ASSISTANT = "email_assistant"
    CUSTOM = "custom"


class AgentStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class LLMProvider(str, enum.Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    CUSTOM = "custom"


class Agent(Base):
    __tablename__ = "agents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    agent_type = Column(SQLEnum(AgentType), nullable=False)
    status = Column(SQLEnum(AgentStatus), default=AgentStatus.DRAFT)

    llm_provider = Column(SQLEnum(LLMProvider), default=LLMProvider.OPENAI)
    llm_model = Column(String(100), default="gpt-4o")
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=4096)
    system_prompt = Column(Text, nullable=True)

    tools_config = Column(JSON, default=list)
    knowledge_base = Column(JSON, default=list)
    webhook_url = Column(String(512), nullable=True)
    allowed_domains = Column(JSON, default=list)

    widget_config = Column(JSON, default=dict)
    embed_token = Column(String(255), nullable=True, unique=True)

    total_conversations = Column(Integer, default=0)
    total_messages = Column(Integer, default=0)
    avg_satisfaction = Column(Float, default=0.0)
    avg_response_time_ms = Column(Integer, default=0)
    resolution_rate = Column(Float, default=0.0)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="agents")
    conversations = relationship("Conversation", back_populates="agent", cascade="all, delete-orphan")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    visitor_id = Column(String(255), nullable=True)

    status = Column(String(50), default="active")
    channel = Column(String(50), default="web")
    metadata_json = Column(JSON, default=dict)

    satisfaction_score = Column(Integer, nullable=True)
    resolved = Column(Boolean, default=False)
    escalated = Column(Boolean, default=False)

    message_count = Column(Integer, default=0)
    total_tokens_used = Column(Integer, default=0)

    started_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    ended_at = Column(DateTime(timezone=True), nullable=True)

    agent = relationship("Agent", back_populates="conversations")
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # user, assistant, system, tool
    content = Column(Text, nullable=False)
    tokens_used = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    tool_calls = Column(JSON, nullable=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    conversation = relationship("Conversation", back_populates="messages")


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    source_url = Column(String(1024), nullable=True)
    file_type = Column(String(50), nullable=True)
    chunk_count = Column(Integer, default=0)
    embedding_status = Column(String(50), default="pending")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

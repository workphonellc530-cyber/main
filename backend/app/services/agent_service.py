import uuid
import secrets
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.agent import Agent, AgentType, AgentStatus, Conversation, Message
from app.models.user import User, PlanTier
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.agents.factory import create_agent
from app.core.config import settings


PLAN_LIMITS = {
    PlanTier.FREE: {"max_agents": 1, "max_messages": 500},
    PlanTier.STARTER: {"max_agents": settings.MAX_AGENTS_STARTER, "max_messages": settings.MAX_MESSAGES_STARTER},
    PlanTier.GROWTH: {"max_agents": settings.MAX_AGENTS_GROWTH, "max_messages": settings.MAX_MESSAGES_GROWTH},
    PlanTier.ENTERPRISE: {"max_agents": settings.MAX_AGENTS_ENTERPRISE, "max_messages": settings.MAX_MESSAGES_ENTERPRISE},
}


class AgentService:
    @staticmethod
    async def create_agent(db: AsyncSession, user: User, data: AgentCreate) -> Agent:
        limits = PLAN_LIMITS.get(user.plan, PLAN_LIMITS[PlanTier.FREE])

        count_result = await db.execute(
            select(func.count(Agent.id)).where(
                Agent.owner_id == user.id,
                Agent.status != AgentStatus.ARCHIVED,
            )
        )
        current_count = count_result.scalar() or 0

        if current_count >= limits["max_agents"]:
            raise ValueError(
                f"Agent limit reached ({limits['max_agents']}). Upgrade your plan to create more agents."
            )

        agent = Agent(
            owner_id=user.id,
            name=data.name,
            description=data.description,
            agent_type=AgentType(data.agent_type),
            llm_provider=data.llm_provider,
            llm_model=data.llm_model,
            temperature=data.temperature,
            max_tokens=data.max_tokens,
            system_prompt=data.system_prompt,
            tools_config=data.tools_config,
            webhook_url=data.webhook_url,
            allowed_domains=data.allowed_domains,
            widget_config=data.widget_config,
            embed_token=secrets.token_urlsafe(32),
        )
        db.add(agent)
        await db.flush()
        await db.refresh(agent)
        return agent

    @staticmethod
    async def get_agents(db: AsyncSession, user: User, skip: int = 0, limit: int = 50) -> tuple[list[Agent], int]:
        count_result = await db.execute(
            select(func.count(Agent.id)).where(Agent.owner_id == user.id)
        )
        total = count_result.scalar() or 0

        result = await db.execute(
            select(Agent)
            .where(Agent.owner_id == user.id)
            .order_by(Agent.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        agents = list(result.scalars().all())
        return agents, total

    @staticmethod
    async def get_agent(db: AsyncSession, user: User, agent_id: uuid.UUID) -> Optional[Agent]:
        result = await db.execute(
            select(Agent).where(Agent.id == agent_id, Agent.owner_id == user.id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update_agent(db: AsyncSession, agent: Agent, data: AgentUpdate) -> Agent:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "status":
                value = AgentStatus(value)
            setattr(agent, field, value)
        agent.updated_at = datetime.now(timezone.utc)
        await db.flush()
        await db.refresh(agent)
        return agent

    @staticmethod
    async def delete_agent(db: AsyncSession, agent: Agent) -> None:
        await db.delete(agent)
        await db.flush()

    @staticmethod
    async def chat(
        db: AsyncSession,
        user: User,
        agent: Agent,
        message: str,
        conversation_id: Optional[uuid.UUID] = None,
        visitor_id: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> dict:
        limits = PLAN_LIMITS.get(user.plan, PLAN_LIMITS[PlanTier.FREE])
        if user.messages_this_month >= limits["max_messages"]:
            raise ValueError("Monthly message limit reached. Upgrade your plan for more messages.")

        if conversation_id:
            conv_result = await db.execute(
                select(Conversation).where(
                    Conversation.id == conversation_id,
                    Conversation.agent_id == agent.id,
                )
            )
            conversation = conv_result.scalar_one_or_none()
        else:
            conversation = None

        if not conversation:
            conversation = Conversation(
                agent_id=agent.id,
                user_id=user.id,
                visitor_id=visitor_id,
                metadata_json=metadata or {},
            )
            db.add(conversation)
            await db.flush()
            await db.refresh(conversation)

        msg_result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.asc())
            .limit(50)
        )
        history = [
            {"role": m.role, "content": m.content} for m in msg_result.scalars().all()
        ]

        user_msg = Message(
            conversation_id=conversation.id,
            role="user",
            content=message,
        )
        db.add(user_msg)

        agent_config = {
            "name": agent.name,
            "system_prompt": agent.system_prompt,
            "llm_provider": agent.llm_provider.value if hasattr(agent.llm_provider, 'value') else agent.llm_provider,
            "llm_model": agent.llm_model,
            "temperature": agent.temperature,
            "max_tokens": agent.max_tokens,
            "tools_config": agent.tools_config,
            "company_name": user.company_name or "the company",
        }
        agent_instance = create_agent(
            agent.agent_type.value if hasattr(agent.agent_type, 'value') else agent.agent_type,
            agent_config,
        )

        result = await agent_instance.execute(message, history)

        assistant_msg = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=result["response"],
            tokens_used=result.get("tokens_used", 0),
            latency_ms=result.get("latency_ms", 0),
            tool_calls=result.get("tool_calls"),
        )
        db.add(assistant_msg)

        conversation.message_count += 2
        conversation.total_tokens_used += result.get("tokens_used", 0)
        agent.total_messages += 2
        agent.total_conversations = max(agent.total_conversations, 1)
        user.messages_this_month += 1

        await db.flush()
        await db.refresh(assistant_msg)

        return {
            "conversation_id": conversation.id,
            "message_id": assistant_msg.id,
            "response": result["response"],
            "tokens_used": result.get("tokens_used", 0),
            "latency_ms": result.get("latency_ms", 0),
        }

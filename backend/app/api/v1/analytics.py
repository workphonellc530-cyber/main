from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.api.deps.auth import get_current_user
from app.models.user import User
from app.models.agent import Agent, AgentStatus, Conversation, Message
from app.schemas.analytics import DashboardStats, AgentAnalytics

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    agents_result = await db.execute(
        select(func.count(Agent.id)).where(Agent.owner_id == user.id)
    )
    total_agents = agents_result.scalar() or 0

    active_result = await db.execute(
        select(func.count(Agent.id)).where(
            Agent.owner_id == user.id, Agent.status == AgentStatus.ACTIVE
        )
    )
    active_agents = active_result.scalar() or 0

    conv_result = await db.execute(
        select(func.count(Conversation.id)).where(Conversation.user_id == user.id)
    )
    total_conversations = conv_result.scalar() or 0

    msg_result = await db.execute(
        select(func.sum(Agent.total_messages)).where(Agent.owner_id == user.id)
    )
    total_messages = msg_result.scalar() or 0

    avg_sat_result = await db.execute(
        select(func.avg(Agent.avg_satisfaction)).where(Agent.owner_id == user.id)
    )
    avg_satisfaction = round(avg_sat_result.scalar() or 0.0, 2)

    avg_res_result = await db.execute(
        select(func.avg(Agent.resolution_rate)).where(Agent.owner_id == user.id)
    )
    resolution_rate = round(avg_res_result.scalar() or 0.0, 2)

    revenue_saved = total_messages * 0.15

    return DashboardStats(
        total_agents=total_agents,
        active_agents=active_agents,
        total_conversations=total_conversations,
        total_messages=total_messages,
        avg_satisfaction=avg_satisfaction,
        resolution_rate=resolution_rate,
        messages_today=0,
        conversations_today=0,
        revenue_saved_estimate=revenue_saved,
        response_time_avg_ms=0,
    )


@router.get("/agents/{agent_id}", response_model=AgentAnalytics)
async def get_agent_analytics(
    agent_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Agent).where(Agent.id == agent_id, Agent.owner_id == user.id)
    )
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    return AgentAnalytics(
        agent_id=str(agent.id),
        agent_name=agent.name,
        total_conversations=agent.total_conversations,
        total_messages=agent.total_messages,
        avg_satisfaction=agent.avg_satisfaction,
        resolution_rate=agent.resolution_rate,
        avg_response_time_ms=agent.avg_response_time_ms,
        top_topics=[],
        hourly_distribution=[0] * 24,
    )

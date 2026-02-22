from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DashboardStats(BaseModel):
    total_agents: int
    active_agents: int
    total_conversations: int
    total_messages: int
    avg_satisfaction: float
    resolution_rate: float
    messages_today: int
    conversations_today: int
    revenue_saved_estimate: float
    response_time_avg_ms: int


class TimeSeriesPoint(BaseModel):
    timestamp: str
    value: float


class AnalyticsResponse(BaseModel):
    period: str
    messages_over_time: list[TimeSeriesPoint]
    conversations_over_time: list[TimeSeriesPoint]
    satisfaction_over_time: list[TimeSeriesPoint]
    top_agents: list[dict]
    channel_distribution: dict[str, int]
    resolution_rates: dict[str, float]


class AgentAnalytics(BaseModel):
    agent_id: str
    agent_name: str
    total_conversations: int
    total_messages: int
    avg_satisfaction: float
    resolution_rate: float
    avg_response_time_ms: int
    top_topics: list[dict]
    hourly_distribution: list[int]

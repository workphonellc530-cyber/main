from typing import Any

from app.agents.base import BaseAgent
from app.agents.customer_support import CustomerSupportAgent
from app.agents.lead_generation import LeadGenerationAgent
from app.agents.content_creator import ContentCreatorAgent
from app.agents.data_analyst import DataAnalystAgent
from app.agents.sales_assistant import SalesAssistantAgent
from app.models.agent import AgentType


AGENT_REGISTRY: dict[str, type[BaseAgent]] = {
    AgentType.CUSTOMER_SUPPORT: CustomerSupportAgent,
    AgentType.LEAD_GENERATION: LeadGenerationAgent,
    AgentType.CONTENT_CREATOR: ContentCreatorAgent,
    AgentType.DATA_ANALYST: DataAnalystAgent,
    AgentType.SALES_ASSISTANT: SalesAssistantAgent,
    AgentType.CODE_REVIEWER: ContentCreatorAgent,
    AgentType.EMAIL_ASSISTANT: ContentCreatorAgent,
    AgentType.CUSTOM: CustomerSupportAgent,
}


def create_agent(agent_type: str, config: dict[str, Any]) -> BaseAgent:
    agent_class = AGENT_REGISTRY.get(agent_type, CustomerSupportAgent)
    return agent_class(config)

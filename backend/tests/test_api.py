"""
Basic test suite for AgentForge AI API.
Run with: pytest backend/tests/ -v
"""
import pytest


def test_imports():
    from app.core.config import settings
    assert settings.APP_NAME == "AgentForge AI"


def test_security_functions():
    from app.core.security import get_password_hash, verify_password, create_access_token, verify_token

    hashed = get_password_hash("testpassword123")
    assert verify_password("testpassword123", hashed)
    assert not verify_password("wrongpassword", hashed)

    token = create_access_token({"sub": "test-user-id", "email": "test@example.com"})
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == "test-user-id"
    assert payload["type"] == "access"


def test_agent_factory():
    from app.agents.factory import create_agent
    from app.agents.customer_support import CustomerSupportAgent
    from app.agents.lead_generation import LeadGenerationAgent
    from app.agents.content_creator import ContentCreatorAgent
    from app.agents.data_analyst import DataAnalystAgent
    from app.agents.sales_assistant import SalesAssistantAgent

    config = {"name": "Test", "llm_provider": "openai", "llm_model": "gpt-4o"}

    agent = create_agent("customer_support", config)
    assert isinstance(agent, CustomerSupportAgent)

    agent = create_agent("lead_generation", config)
    assert isinstance(agent, LeadGenerationAgent)

    agent = create_agent("content_creator", config)
    assert isinstance(agent, ContentCreatorAgent)

    agent = create_agent("data_analyst", config)
    assert isinstance(agent, DataAnalystAgent)

    agent = create_agent("sales_assistant", config)
    assert isinstance(agent, SalesAssistantAgent)


def test_plan_details():
    from app.schemas.billing import PLANS

    assert "free" in PLANS
    assert "starter" in PLANS
    assert "growth" in PLANS
    assert "enterprise" in PLANS

    assert PLANS["starter"].price_monthly == 49900
    assert PLANS["growth"].price_monthly == 149900
    assert PLANS["enterprise"].price_monthly == 499900
    assert PLANS["free"].max_agents == 1
    assert PLANS["enterprise"].max_agents == 999


def test_agent_base_build_messages():
    from app.agents.customer_support import CustomerSupportAgent

    config = {
        "name": "Test Support",
        "system_prompt": "You are a helpful assistant.",
        "llm_provider": "openai",
        "llm_model": "gpt-4o",
    }
    agent = CustomerSupportAgent(config)
    messages = agent.build_messages("Hello", [{"role": "user", "content": "Hi"}])

    assert messages[0]["role"] == "system"
    assert messages[1]["role"] == "user"
    assert messages[1]["content"] == "Hi"
    assert messages[2]["role"] == "user"
    assert messages[2]["content"] == "Hello"

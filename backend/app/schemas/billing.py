from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID


class CreateCheckoutSession(BaseModel):
    plan: str  # starter, growth, enterprise
    success_url: str = "https://agentforge.ai/dashboard?session_id={CHECKOUT_SESSION_ID}"
    cancel_url: str = "https://agentforge.ai/billing"


class CheckoutSessionResponse(BaseModel):
    session_id: str
    url: str


class SubscriptionResponse(BaseModel):
    plan: str
    status: str
    current_period_end: Optional[datetime]
    cancel_at_period_end: bool = False


class InvoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    amount_cents: int
    currency: str
    status: str
    period_start: Optional[datetime]
    period_end: Optional[datetime]
    paid_at: Optional[datetime]
    created_at: datetime


class UsageSummary(BaseModel):
    period: str
    total_messages: int
    total_conversations: int
    total_api_calls: int
    total_tokens: int
    estimated_cost_cents: int


class PlanDetails(BaseModel):
    name: str
    price_monthly: int
    max_agents: int
    max_messages: int
    features: list[str]


PLANS = {
    "free": PlanDetails(
        name="Free",
        price_monthly=0,
        max_agents=1,
        max_messages=500,
        features=[
            "1 AI Agent",
            "500 messages/month",
            "Basic analytics",
            "Community support",
            "Web widget",
        ],
    ),
    "starter": PlanDetails(
        name="Starter",
        price_monthly=49900,
        max_agents=3,
        max_messages=10000,
        features=[
            "3 AI Agents",
            "10,000 messages/month",
            "Advanced analytics",
            "Email support",
            "Custom branding",
            "API access",
            "Webhook integrations",
        ],
    ),
    "growth": PlanDetails(
        name="Growth",
        price_monthly=149900,
        max_agents=25,
        max_messages=100000,
        features=[
            "25 AI Agents",
            "100,000 messages/month",
            "Full analytics suite",
            "Priority support",
            "Custom branding",
            "Full API access",
            "All integrations",
            "Knowledge base (RAG)",
            "Multi-language support",
            "Team collaboration",
        ],
    ),
    "enterprise": PlanDetails(
        name="Enterprise",
        price_monthly=499900,
        max_agents=999,
        max_messages=10000000,
        features=[
            "Unlimited AI Agents",
            "10M+ messages/month",
            "Enterprise analytics",
            "Dedicated account manager",
            "White-label solution",
            "Full API + SDK",
            "All integrations",
            "Advanced RAG pipeline",
            "SSO / SAML",
            "SLA guarantee",
            "Custom model fine-tuning",
            "On-premise deployment option",
        ],
    ),
}

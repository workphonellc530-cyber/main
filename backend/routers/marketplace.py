"""Agent Marketplace - 25% commission revenue stream"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

MARKETPLACE_COMMISSION = 0.25  # 25% - industry standard

# Sample marketplace agents
MARKETPLACE_AGENTS = [
    {
        "id": "mp_1",
        "name": "LinkedIn Outreach Pro",
        "creator": "LeadGen Labs",
        "price": 299,
        "revenue_generated": 45000,
        "rating": 4.9,
        "sales_count": 127,
        "commission_earned": 9500
    },
    {
        "id": "mp_2",
        "name": "Cold Email AI",
        "creator": "SalesAI Co",
        "price": 199,
        "revenue_generated": 89000,
        "rating": 4.8,
        "sales_count": 312,
        "commission_earned": 15500
    },
    {
        "id": "mp_3",
        "name": "Enterprise Account Research",
        "creator": "EnterpriseAI",
        "price": 999,
        "revenue_generated": 125000,
        "rating": 4.95,
        "sales_count": 45,
        "commission_earned": 11250
    }
]

class ListAgentRequest(BaseModel):
    agent_id: int
    price: float
    description: str

@router.get("/agents")
async def list_marketplace_agents(
    category: Optional[str] = None,
    min_revenue: Optional[float] = None,
    limit: int = Query(20, le=50)
):
    """Browse marketplace - 25% commission on all sales"""
    agents = MARKETPLACE_AGENTS
    if min_revenue:
        agents = [a for a in agents if a["revenue_generated"] >= min_revenue]
    
    return {
        "agents": agents[:limit],
        "commission_rate": MARKETPLACE_COMMISSION,
        "platform_revenue_ytd": 36250,
        "message": "25% commission on every transaction"
    }

@router.post("/purchase")
async def purchase_agent(agent_id: str, buyer_id: int):
    """Process marketplace purchase - commission automatically applied"""
    price = 299  # Would lookup from agent_id
    commission = price * MARKETPLACE_COMMISSION
    
    return {
        "status": "success",
        "agent_id": agent_id,
        "amount": price,
        "commission_to_platform": commission,
        "creator_payout": price - commission,
        "message": f"Purchase complete. ${commission:.2f} platform revenue."
    }

@router.get("/revenue")
async def marketplace_revenue():
    """Marketplace revenue dashboard - for $200K tracking"""
    return {
        "commission_rate": MARKETPLACE_COMMISSION,
        "transactions_today": 0,
        "gmv_today": 0,
        "commission_today": 0,
        "target_14_day": 50000,
        "path": "~200 transactions at $250 avg = $50K commission"
    }

"""
ProfitAI Platform - AI Agent Backend
Multi-revenue stream AI platform for lead gen, sales, and marketplace
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from routers import agents, marketplace, leads, api_keys
from database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    # Cleanup if needed

app = FastAPI(
    title="ProfitAI Platform API",
    description="AI Agent Platform - Lead Gen, Sales Automation, Marketplace",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(marketplace.router, prefix="/api/v1/marketplace", tags=["Marketplace"])
app.include_router(leads.router, prefix="/api/v1/leads", tags=["Leads"])
app.include_router(api_keys.router, prefix="/api/v1", tags=["API Keys"])

@app.get("/")
async def root():
    return {
        "platform": "ProfitAI",
        "status": "operational",
        "revenue_streams": [
            "ai_agents",
            "marketplace",
            "enterprise_api",
            "lead_generation"
        ],
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

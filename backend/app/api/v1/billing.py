from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps.auth import get_current_user
from app.models.user import User
from app.schemas.billing import (
    CreateCheckoutSession, CheckoutSessionResponse, InvoiceResponse, PLANS, PlanDetails,
)
from app.services.billing_service import BillingService

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.get("/plans", response_model=dict[str, PlanDetails])
async def get_plans():
    return PLANS


@router.post("/checkout", response_model=CheckoutSessionResponse)
async def create_checkout(
    data: CreateCheckoutSession,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await BillingService.create_checkout_session(
            db, user, data.plan, data.success_url, data.cancel_url
        )
        return CheckoutSessionResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        return await BillingService.handle_webhook(db, payload, sig_header)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/invoices", response_model=list[InvoiceResponse])
async def get_invoices(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    invoices = await BillingService.get_invoices(db, user)
    return [InvoiceResponse.model_validate(inv) for inv in invoices]


@router.post("/cancel")
async def cancel_subscription(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await BillingService.cancel_subscription(db, user)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/subscription")
async def get_subscription(user: User = Depends(get_current_user)):
    return {
        "plan": user.plan.value if hasattr(user.plan, 'value') else user.plan,
        "status": user.subscription_status,
        "messages_used": user.messages_this_month,
        "api_calls_used": user.api_calls_this_month,
    }

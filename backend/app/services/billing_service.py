import stripe
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.user import User, PlanTier
from app.models.billing import Invoice, WebhookEvent

if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

PLAN_PRICE_MAP = {
    "starter": settings.STRIPE_PRICE_STARTER,
    "growth": settings.STRIPE_PRICE_GROWTH,
    "enterprise": settings.STRIPE_PRICE_ENTERPRISE,
}


class BillingService:
    @staticmethod
    async def create_checkout_session(
        db: AsyncSession, user: User, plan: str, success_url: str, cancel_url: str
    ) -> dict:
        if not settings.STRIPE_SECRET_KEY:
            raise ValueError("Stripe is not configured")

        price_id = PLAN_PRICE_MAP.get(plan)
        if not price_id:
            raise ValueError(f"Invalid plan: {plan}")

        if not user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.full_name,
                metadata={"user_id": str(user.id)},
            )
            user.stripe_customer_id = customer.id
            await db.flush()

        session = stripe.checkout.Session.create(
            customer=user.stripe_customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"user_id": str(user.id), "plan": plan},
            allow_promotion_codes=True,
        )

        return {"session_id": session.id, "url": session.url}

    @staticmethod
    async def handle_webhook(db: AsyncSession, payload: bytes, sig_header: str) -> dict:
        if not settings.STRIPE_WEBHOOK_SECRET:
            raise ValueError("Stripe webhook secret not configured")

        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )

        webhook_event = WebhookEvent(
            source="stripe",
            event_type=event.type,
            event_id=event.id,
            payload=event.data.object,
        )
        db.add(webhook_event)

        if event.type == "checkout.session.completed":
            await BillingService._handle_checkout_completed(db, event.data.object)
        elif event.type == "customer.subscription.updated":
            await BillingService._handle_subscription_updated(db, event.data.object)
        elif event.type == "customer.subscription.deleted":
            await BillingService._handle_subscription_deleted(db, event.data.object)
        elif event.type == "invoice.paid":
            await BillingService._handle_invoice_paid(db, event.data.object)

        webhook_event.processed = "completed"
        await db.flush()

        return {"status": "ok"}

    @staticmethod
    async def _handle_checkout_completed(db: AsyncSession, session) -> None:
        user_id = session.metadata.get("user_id")
        plan = session.metadata.get("plan")
        if not user_id or not plan:
            return

        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user:
            user.plan = PlanTier(plan)
            user.stripe_subscription_id = session.subscription
            user.subscription_status = "active"

    @staticmethod
    async def _handle_subscription_updated(db: AsyncSession, subscription) -> None:
        result = await db.execute(
            select(User).where(User.stripe_subscription_id == subscription.id)
        )
        user = result.scalar_one_or_none()
        if user:
            user.subscription_status = subscription.status

    @staticmethod
    async def _handle_subscription_deleted(db: AsyncSession, subscription) -> None:
        result = await db.execute(
            select(User).where(User.stripe_subscription_id == subscription.id)
        )
        user = result.scalar_one_or_none()
        if user:
            user.plan = PlanTier.FREE
            user.subscription_status = "cancelled"
            user.stripe_subscription_id = None

    @staticmethod
    async def _handle_invoice_paid(db: AsyncSession, invoice_data) -> None:
        result = await db.execute(
            select(User).where(User.stripe_customer_id == invoice_data.customer)
        )
        user = result.scalar_one_or_none()
        if user:
            db_invoice = Invoice(
                user_id=user.id,
                stripe_invoice_id=invoice_data.id,
                amount_cents=invoice_data.amount_paid,
                status="paid",
            )
            db.add(db_invoice)

    @staticmethod
    async def get_invoices(db: AsyncSession, user: User) -> list[Invoice]:
        result = await db.execute(
            select(Invoice)
            .where(Invoice.user_id == user.id)
            .order_by(Invoice.created_at.desc())
            .limit(50)
        )
        return list(result.scalars().all())

    @staticmethod
    async def cancel_subscription(db: AsyncSession, user: User) -> dict:
        if not user.stripe_subscription_id:
            raise ValueError("No active subscription")

        stripe.Subscription.modify(
            user.stripe_subscription_id,
            cancel_at_period_end=True,
        )
        user.subscription_status = "cancelling"
        await db.flush()

        return {"status": "cancelling", "message": "Subscription will cancel at period end"}

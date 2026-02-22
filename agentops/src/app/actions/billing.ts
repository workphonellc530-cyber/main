"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getAppUrl, getStripeConfig } from "@/lib/env";
import { requireUserContext } from "@/lib/current";
import { getStripeClient } from "@/lib/stripe";

export type BillingActionState =
  | { ok: true }
  | { ok: false; error: string };

export async function startCheckoutAction(): Promise<BillingActionState> {
  const { org, user, plan } = await requireUserContext();
  const { priceId } = getStripeConfig();
  if (!priceId) {
    return {
      ok: false,
      error:
        "Missing STRIPE_PRICE_ID. Create a recurring price in Stripe and set STRIPE_PRICE_ID.",
    };
  }

  const stripe = getStripeClient();

  let stripeCustomerId = plan?.stripeCustomerId || null;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: org.name,
      metadata: { orgId: org.id },
    });
    stripeCustomerId = customer.id;

    await prisma.plan.upsert({
      where: { orgId: org.id },
      create: { orgId: org.id, tier: "FREE", stripeCustomerId },
      update: { stripeCustomerId },
    });
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    allow_promotion_codes: true,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/app/billing?success=1`,
    cancel_url: `${appUrl}/app/billing?canceled=1`,
    metadata: { orgId: org.id },
  });

  if (!session.url) {
    return { ok: false, error: "Stripe session missing URL. Please try again." };
  }

  redirect(session.url);
}

export async function openCustomerPortalAction(): Promise<BillingActionState> {
  const { plan } = await requireUserContext();
  if (!plan?.stripeCustomerId) {
    return { ok: false, error: "No Stripe customer found for this org." };
  }

  const stripe = getStripeClient();
  const appUrl = getAppUrl();
  const portal = await stripe.billingPortal.sessions.create({
    customer: plan.stripeCustomerId,
    return_url: `${appUrl}/app/billing`,
  });

  redirect(portal.url);
}

export async function startCheckoutFormAction(
  _prevState: BillingActionState,
  _formData: FormData,
): Promise<BillingActionState> {
  void _prevState;
  void _formData;
  return startCheckoutAction();
}

export async function openCustomerPortalFormAction(
  _prevState: BillingActionState,
  _formData: FormData,
): Promise<BillingActionState> {
  void _prevState;
  void _formData;
  return openCustomerPortalAction();
}


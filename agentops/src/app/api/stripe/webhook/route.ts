import type Stripe from "stripe";
import { headers } from "next/headers";

import { prisma } from "@/lib/db";
import { getStripeConfig } from "@/lib/env";
import { getStripeClient } from "@/lib/stripe";

function isProStatus(status: Stripe.Subscription.Status) {
  return status === "active" || status === "trialing";
}

export async function POST(request: Request) {
  const { webhookSecret } = getStripeConfig();
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const stripe = getStripeClient();
  const hdrs = await headers();
  const signature = hdrs.get("stripe-signature");
  if (!signature) return new Response("Missing stripe-signature header", { status: 400 });

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return new Response(message, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.orgId;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;

        if (orgId && subscriptionId && customerId) {
          const subscription = (await stripe.subscriptions.retrieve(
            subscriptionId,
          )) as unknown as Stripe.Subscription;
          await prisma.plan.upsert({
            where: { orgId },
            create: {
              orgId,
              tier: isProStatus(subscription.status) ? "PRO" : "FREE",
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id,
              status: subscription.status,
              currentPeriodEnd: null,
            },
            update: {
              tier: isProStatus(subscription.status) ? "PRO" : "FREE",
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id,
              status: subscription.status,
              currentPeriodEnd: null,
            },
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.plan.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            tier: isProStatus(subscription.status) ? "PRO" : "FREE",
            status: subscription.status,
            stripePriceId: subscription.items.data[0]?.price.id,
            currentPeriodEnd: null,
          },
        });
        break;
      }
      default:
        // Ignore all other events.
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    return new Response(message, { status: 500 });
  }
}


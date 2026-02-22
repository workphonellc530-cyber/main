import Stripe from "stripe";

import { getStripeConfig } from "@/lib/env";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

export function getStripeClient() {
  const { secretKey } = getStripeConfig();
  if (!secretKey) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Add it to enable billing features.",
    );
  }

  if (!globalForStripe.stripe) {
    globalForStripe.stripe = new Stripe(secretKey);
  }

  return globalForStripe.stripe;
}


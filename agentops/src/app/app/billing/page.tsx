import { BillingButtons } from "@/components/billing-buttons";
import { getStripeConfig } from "@/lib/env";
import { requireUserContext } from "@/lib/current";

export default async function BillingPage() {
  const { plan } = await requireUserContext();
  const stripe = getStripeConfig();
  const stripeReady = Boolean(stripe.secretKey && stripe.priceId);
  const isPro = plan?.tier === "PRO";

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Billing
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Turn this into a sellable product: Stripe subscription checkout +
          customer portal + plan gating.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-zinc-600">Current plan</p>
          <p className="mt-2 text-xl font-semibold text-zinc-900">
            {plan?.tier || "FREE"}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Free includes up to <span className="font-medium">10</span> successful
            runs total. Pro removes the cap.
          </p>

          <div className="mt-6">
            {stripeReady ? (
              <BillingButtons isPro={isPro} />
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Stripe is not configured.</p>
                <p className="mt-2">
                  Set <code className="rounded bg-white px-1">STRIPE_SECRET_KEY</code>{" "}
                  and <code className="rounded bg-white px-1">STRIPE_PRICE_ID</code>{" "}
                  to enable checkout.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-zinc-600">Webhooks</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Configure a Stripe webhook to keep plan status in sync.
          </p>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800">
            <p className="font-medium">Endpoint</p>
            <p className="mt-2 font-mono">POST /api/stripe/webhook</p>
            <p className="mt-3 font-medium">Required env</p>
            <p className="mt-2 font-mono">STRIPE_WEBHOOK_SECRET</p>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Tip: in dev, use the Stripe CLI to forward events to localhost.
          </p>
        </div>
      </div>
    </div>
  );
}


"use client";

import * as React from "react";

import type { BillingActionState } from "@/app/actions/billing";
import {
  openCustomerPortalFormAction,
  startCheckoutFormAction,
} from "@/app/actions/billing";
import { Button } from "@/components/ui/button";

export function BillingButtons({ isPro }: { isPro: boolean }) {
  const [upgradeState, upgradeAction, isUpgradePending] =
    React.useActionState<BillingActionState, FormData>(
      startCheckoutFormAction,
      { ok: true },
    );

  const [portalState, portalAction, isPortalPending] =
    React.useActionState<BillingActionState, FormData>(
      openCustomerPortalFormAction,
      { ok: true },
    );

  return (
    <div className="grid gap-3">
      {!isPro ? (
        <form action={upgradeAction}>
          <Button type="submit" disabled={isUpgradePending}>
            {isUpgradePending ? "Redirecting…" : "Upgrade to Pro"}
          </Button>
        </form>
      ) : (
        <form action={portalAction}>
          <Button type="submit" disabled={isPortalPending} variant="secondary">
            {isPortalPending ? "Opening…" : "Manage subscription"}
          </Button>
        </form>
      )}

      {upgradeState.ok === false ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {upgradeState.error}
        </p>
      ) : null}

      {portalState.ok === false ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {portalState.error}
        </p>
      ) : null}
    </div>
  );
}


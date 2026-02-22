"use client";

import * as React from "react";

import type { AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "signup";
  action: (
    prevState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
}) {
  const [state, formAction, isPending] = React.useActionState<AuthActionState>(
    action,
    { ok: true },
  );

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label className="text-sm font-medium text-zinc-900">Email</label>
        <Input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="mt-2"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-900">Password</label>
        <Input
          name="password"
          type="password"
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder={mode === "signup" ? "At least 10 characters" : "••••••••"}
          className="mt-2"
        />
      </div>

      {state.ok === false ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Working…"
          : mode === "signup"
            ? "Create account"
            : "Log in"}
      </Button>
    </form>
  );
}


import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId && session.orgId) redirect("/app");

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
        <div>
          <Link href="/" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
            ← Back
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            Log in
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Secure session cookie login for your Agent Console.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <AuthForm mode="login" action={loginAction} />
        </div>

        <p className="text-sm text-zinc-600">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-zinc-900 hover:underline">
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  );
}


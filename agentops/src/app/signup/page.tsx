import Link from "next/link";
import { redirect } from "next/navigation";

import { signupAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/session";

export default async function SignupPage() {
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
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Creates a user + organization, then opens the Agent Console.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <AuthForm mode="signup" action={signupAction} />
        </div>

        <p className="text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 hover:underline">
            Log in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}


import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { requireUserContext } from "@/lib/current";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, org, plan } = await requireUserContext();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight text-zinc-900">
              AgentOps
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-zinc-700">
              <Link href="/app" className="hover:text-zinc-900">
                Dashboard
              </Link>
              <Link href="/app/run" className="hover:text-zinc-900">
                Run
              </Link>
              <Link href="/app/runs" className="hover:text-zinc-900">
                History
              </Link>
              <Link href="/app/billing" className="hover:text-zinc-900">
                Billing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-zinc-700">{org.name}</p>
              <p className="text-xs text-zinc-500">
                {user.email} · {plan?.tier || "FREE"}
              </p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}


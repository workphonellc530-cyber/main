import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireUserContext } from "@/lib/current";

export default async function AppHomePage() {
  const { org, plan } = await requireUserContext();
  const recent = await prisma.agentRun.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Agent Console
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Run playbooks, capture audit history, and (optionally) bill customers
          via Stripe.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app/run"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Run a playbook
          </Link>
          <Link
            href="/app/runs"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            View history
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Plan: <span className="font-medium text-zinc-700">{plan?.tier || "FREE"}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-zinc-900">Recent runs</p>
            <Link
              href="/app/runs"
              className="text-sm font-medium text-zinc-900 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-zinc-200 rounded-2xl border border-zinc-200">
            {recent.length === 0 ? (
              <p className="px-4 py-6 text-sm text-zinc-600">
                No runs yet.{" "}
                <Link href="/app/run" className="font-medium text-zinc-900 hover:underline">
                  Run your first playbook
                </Link>
                .
              </p>
            ) : (
              recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{r.workflow}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(r.createdAt).toLocaleString()} · {r.status || "RUNNING"}
                    </p>
                  </div>
                  <Link
                    href={`/app/runs/${r.id}`}
                    className="text-sm font-medium text-zinc-900 hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-zinc-600">Ship fast</p>
          <p className="mt-2 font-semibold text-zinc-900">Sell one niche</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Pick a vertical (agencies, Shopify, clinics). Charge a setup fee +
            monthly retainer. Use run history as proof.
          </p>
          <Link
            href="/app/billing"
            className="mt-4 inline-flex text-sm font-medium text-zinc-900 hover:underline"
          >
            Configure billing →
          </Link>
        </div>
      </div>
    </div>
  );
}


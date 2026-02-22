import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireUserContext } from "@/lib/current";

export default async function RunsPage() {
  const { org } = await requireUserContext();
  const runs = await prisma.agentRun.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Run history
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Latest runs for your organization. Click a run to see input/output and
          errors.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-xs font-medium text-zinc-600">
          <div className="col-span-3">When</div>
          <div className="col-span-3">Workflow</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-4">Run</div>
        </div>
        <div className="divide-y divide-zinc-200">
          {runs.length === 0 ? (
            <div className="px-5 py-8 text-sm text-zinc-600">
              No runs yet.{" "}
              <Link href="/app/run" className="font-medium text-zinc-900 hover:underline">
                Run a playbook
              </Link>
              .
            </div>
          ) : (
            runs.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 items-center px-5 py-3 text-sm"
              >
                <div className="col-span-3 text-zinc-600">
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="col-span-3 font-medium text-zinc-900">
                  {r.workflow}
                </div>
                <div className="col-span-2">
                  <span
                    className={
                      r.status === "SUCCESS"
                        ? "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
                        : r.status === "ERROR"
                          ? "rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                          : "rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700"
                    }
                  >
                    {r.status || "RUNNING"}
                  </span>
                </div>
                <div className="col-span-4">
                  <Link
                    href={`/app/runs/${r.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { requireUserContext } from "@/lib/current";

export default async function RunDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { org } = await requireUserContext();
  const { id } = params;

  const run = await prisma.agentRun.findFirst({
    where: { id, orgId: org.id },
  });

  if (!run) notFound();

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-600">Run</p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
              {run.workflow}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {new Date(run.createdAt).toLocaleString()} ·{" "}
              {run.status || "RUNNING"}
              {run.model ? ` · ${run.provider}/${run.model}` : ""}
            </p>
          </div>
          <Link
            href="/app/runs"
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            ← Back to history
          </Link>
        </div>
      </div>

      {run.error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          <p className="font-semibold">Error</p>
          <p className="mt-2 whitespace-pre-wrap">{run.error}</p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Input</h2>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-900">
            {JSON.stringify(run.input, null, 2)}
          </pre>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Output</h2>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-900">
            {run.output}
          </pre>
        </div>
      </div>
    </div>
  );
}


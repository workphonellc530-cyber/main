"use client";

import * as React from "react";
import Link from "next/link";

import type { RunActionState } from "@/app/actions/agent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { workflowCatalog } from "@/lib/workflow-catalog";

export function RunForm({
  action,
}: {
  action: (
    prevState: RunActionState,
    formData: FormData,
  ) => Promise<RunActionState>;
}) {
  const [workflow, setWorkflow] = React.useState(workflowCatalog[0]!.id);
  const [input, setInput] = React.useState<string>(
    JSON.stringify(workflowCatalog[0]!.exampleInput, null, 2),
  );

  const [state, formAction, isPending] = React.useActionState<
    RunActionState,
    FormData
  >(action, { ok: false, error: "" });

  const currentMeta = workflowCatalog.find((w) => w.id === workflow)!;

  return (
    <div className="grid gap-6">
      <form action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-900">Workflow</label>
          <select
            name="workflow"
            value={workflow}
            onChange={(e) => {
              const next = e.target.value as (typeof workflowCatalog)[number]["id"];
              setWorkflow(next);
              const meta = workflowCatalog.find((w) => w.id === next);
              if (meta) setInput(JSON.stringify(meta.exampleInput, null, 2));
            }}
            className={cn(
              "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
            )}
          >
            {workflowCatalog.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500">{currentMeta.description}</p>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-zinc-900">
              JSON input
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setInput(JSON.stringify(currentMeta.exampleInput, null, 2))
              }
            >
              Load example
            </Button>
          </div>
          <Textarea
            name="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        {state.ok === false && state.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Running…" : "Run playbook"}
        </Button>
      </form>

      {state.ok === true ? (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">Output</h2>
            <Link
              href={`/app/runs/${state.runId}`}
              className="text-sm font-medium text-zinc-900 hover:underline"
            >
              View run details →
            </Link>
          </div>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-900">
            {state.output}
          </pre>
        </div>
      ) : null}
    </div>
  );
}


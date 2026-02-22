import { runWorkflowAction } from "@/app/actions/agent";
import { RunForm } from "@/components/run-form";

export default function RunPage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Run a playbook
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Pick a workflow, paste JSON, run it, and save the result with an audit
          trail for your organization.
        </p>
      </div>

      <RunForm action={runWorkflowAction} />
    </div>
  );
}


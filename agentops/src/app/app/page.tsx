import Link from "next/link";

export default function AppHomePage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Agent Console
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          This is where you run playbooks, capture audit history, and (optionally)
          bill customers via Stripe. Next up: auth + database + agent runs.
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
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-zinc-600">Step 1</p>
          <p className="mt-2 font-semibold text-zinc-900">Connect an LLM</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Add <code className="rounded bg-zinc-100 px-1">OPENAI_API_KEY</code>{" "}
            and run playbooks in seconds.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-zinc-600">Step 2</p>
          <p className="mt-2 font-semibold text-zinc-900">Sell a niche offer</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Start with one vertical (e.g. agencies, Shopify, clinics). Charge a
            setup fee + monthly retainer.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-zinc-600">Step 3</p>
          <p className="mt-2 font-semibold text-zinc-900">Turn on billing</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Configure Stripe keys and use hosted checkout + customer portal.
          </p>
        </div>
      </div>
    </div>
  );
}


import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                Ship an AI agent product in days, not months
              </p>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
                A profitable AI‑agent platform you can sell as a high‑ticket
                automation.
              </h1>
              <p className="mt-4 text-pretty text-lg leading-8 text-zinc-600">
                Turn inbound leads into booked calls, and support tickets into
                resolved customers, using battle-tested playbooks + audit logs +
                billing in one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Start free
                </Link>
                <Link
                  href="/app"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                >
                  Open console
                </Link>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                No hype: revenue depends on your niche + distribution. This repo
                gives you the product and a realistic 14‑day GTM plan.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-600">
                    Playbook: Lead Qualifier
                  </p>
                  <p className="mt-2 text-sm text-zinc-800">
                    “Thanks for reaching out. Here’s what we need, here’s the
                    timeline, and here’s a booking link…”
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-600">
                    Playbook: Support Autoresponder
                  </p>
                  <p className="mt-2 text-sm text-zinc-800">
                    “We found your order, issued the replacement, and updated
                    tracking. Here’s what happens next…”
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-medium text-zinc-600">
                    Playbook: Proposal Writer
                  </p>
                  <p className="mt-2 text-sm text-zinc-800">
                    A client-ready scope, timeline, risks, and pricing options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="playbooks"
          className="mx-auto max-w-6xl px-4 pb-6"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-zinc-900">
                Opinionated playbooks
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Prebuilt workflows designed for selling as a service: qualify,
                respond, propose.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-zinc-900">Audit + history</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Every run is stored with inputs/outputs so you can prove ROI and
                refine prompts fast.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-zinc-900">Billing-ready</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Stripe checkout + customer portal so you can charge on day one.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Price it like a revenue tool.
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Sell as a productized service: setup + monthly retainer + ROI
                  case study. The code supports subscriptions and run history.
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Start free
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <h3 className="font-semibold text-zinc-900">Starter</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  $0 to test playbooks locally
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li>Console + history</li>
                  <li>3 playbooks</li>
                  <li>Local DB</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <h3 className="font-semibold text-zinc-900">Pro</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  $499–$2,500/mo (recommended) + setup fee
                </p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li>Stripe subscriptions</li>
                  <li>Org-based usage</li>
                  <li>Deploy anywhere</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm md:grid-cols-2 md:p-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                A realistic 14‑day plan is included.
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                The fastest path to $200k is typically a high-ticket offer with
                tight scope and clear ROI. This repo includes scripts, niches,
                and a day-by-day checklist.
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <Link
                href="/app"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
              >
                Open console
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-10 text-sm text-zinc-600">
          <p>© {new Date().getFullYear()} AgentOps Revenue Engine</p>
          <p className="text-zinc-500">
            Built to sell; no revenue guarantees.
          </p>
        </div>
      </footer>
    </div>
  );
}

from __future__ import annotations

import argparse
from pathlib import Path

from .core import (
    Scenario,
    build_funnel,
    format_funnel_report,
    format_lead_rankings,
    format_simulation_report,
    generate_outreach_assets,
    load_leads,
    rank_leads,
    render_execution_plan,
    simulate_profit_outcomes,
)


def _load_scenario(path: str | None) -> Scenario:
    if not path:
        return Scenario()
    return Scenario.from_json(path)


def _write_output(path: str | None, content: str) -> None:
    if not path:
        return
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
    print(f"Saved: {target}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="profitpilot",
        description="14-day AI revenue sprint planner and execution toolkit.",
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    funnel_parser = subparsers.add_parser(
        "funnel", help="Calculate required funnel metrics to hit target profit."
    )
    funnel_parser.add_argument("--config", help="Path to JSON scenario config.", default=None)
    funnel_parser.add_argument("--output", help="Optional output text file.", default=None)

    simulate_parser = subparsers.add_parser(
        "simulate", help="Run Monte Carlo simulation on the sales funnel."
    )
    simulate_parser.add_argument("--config", help="Path to JSON scenario config.", default=None)
    simulate_parser.add_argument("--runs", type=int, default=5000, help="Number of simulation runs.")
    simulate_parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility.")
    simulate_parser.add_argument("--output", help="Optional output text file.", default=None)

    score_parser = subparsers.add_parser("score-leads", help="Rank leads by opportunity score.")
    score_parser.add_argument("--lead-file", required=True, help="CSV file containing leads.")
    score_parser.add_argument("--top", type=int, default=10, help="Number of leads to show.")
    score_parser.add_argument("--output", help="Optional output text file.", default=None)

    assets_parser = subparsers.add_parser(
        "generate-assets",
        help="Generate personalized outreach assets for top-ranked leads.",
    )
    assets_parser.add_argument("--lead-file", required=True, help="CSV file containing leads.")
    assets_parser.add_argument("--top", type=int, default=5, help="Number of lead assets to generate.")
    assets_parser.add_argument("--output", default="reports/outreach_assets.md", help="Output markdown path.")

    plan_parser = subparsers.add_parser(
        "build-plan", help="Generate a 14-day execution plan markdown file."
    )
    plan_parser.add_argument("--config", help="Path to JSON scenario config.", default=None)
    plan_parser.add_argument("--output", default="reports/14_day_plan.md", help="Output markdown path.")

    return parser


def run(args: argparse.Namespace) -> int:
    if args.command == "funnel":
        scenario = _load_scenario(args.config)
        funnel = build_funnel(scenario)
        report = format_funnel_report(scenario, funnel)
        print(report)
        _write_output(args.output, report + "\n")
        return 0

    if args.command == "simulate":
        scenario = _load_scenario(args.config)
        summary = simulate_profit_outcomes(scenario, runs=args.runs, seed=args.seed)
        report = format_simulation_report(summary)
        print(report)
        _write_output(args.output, report + "\n")
        return 0

    if args.command == "score-leads":
        leads = load_leads(args.lead_file)
        rankings = rank_leads(leads)
        report = format_lead_rankings(rankings, top=args.top)
        print(report)
        _write_output(args.output, report + "\n")
        return 0

    if args.command == "generate-assets":
        leads = load_leads(args.lead_file)
        rankings = rank_leads(leads)
        assets_markdown = generate_outreach_assets(rankings, top=args.top)
        print(assets_markdown)
        _write_output(args.output, assets_markdown)
        return 0

    if args.command == "build-plan":
        scenario = _load_scenario(args.config)
        funnel = build_funnel(scenario)
        plan = render_execution_plan(scenario, funnel)
        print(plan)
        _write_output(args.output, plan + "\n")
        return 0

    raise ValueError(f"Unknown command: {args.command}")


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return run(args)

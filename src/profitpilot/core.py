from __future__ import annotations

import csv
import json
import math
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Sequence


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        return float(str(value).strip())
    except (TypeError, ValueError):
        return default


def _safe_percent(value: Any, default: float = 0.0) -> float:
    if value is None:
        return default
    text = str(value).strip()
    if not text:
        return default
    if text.endswith("%"):
        return _safe_float(text[:-1], default) / 100.0
    numeric = _safe_float(text, default)
    if numeric > 1:
        return numeric / 100.0
    return numeric


def _currency(value: float) -> str:
    return f"${value:,.0f}"


def _ceil_div(numerator: float, denominator: float) -> int:
    if numerator <= 0:
        return 0
    if denominator <= 0:
        raise ValueError("Denominator must be positive.")
    return int(math.ceil(numerator / denominator))


def _quantile(sorted_values: Sequence[float], q: float) -> float:
    if not sorted_values:
        return 0.0
    if q <= 0:
        return sorted_values[0]
    if q >= 1:
        return sorted_values[-1]
    idx = (len(sorted_values) - 1) * q
    lower = math.floor(idx)
    upper = math.ceil(idx)
    if lower == upper:
        return sorted_values[lower]
    return sorted_values[lower] + (sorted_values[upper] - sorted_values[lower]) * (idx - lower)


@dataclass
class Scenario:
    # Target outcome
    target_profit: float = 200_000.0
    days: int = 14

    # Offer economics
    setup_fee: float = 25_000.0
    upfront_collection_ratio: float = 0.80
    monthly_retainer: float = 3_000.0

    # Sales conversion assumptions
    outreach_per_day: int = 350
    reply_rate: float = 0.08
    meeting_book_rate: float = 0.30
    show_rate: float = 0.75
    close_rate: float = 0.25

    # Alternative acquisition
    referral_deals: int = 2

    # 14-day costs to execute sprint
    ad_budget: float = 3_000.0
    contractor_cost: float = 12_000.0
    software_cost: float = 1_500.0

    @property
    def fixed_costs(self) -> float:
        return self.ad_budget + self.contractor_cost + self.software_cost

    @property
    def cash_collected_per_deal(self) -> float:
        return self.setup_fee * self.upfront_collection_ratio

    @property
    def outreach_to_close_rate(self) -> float:
        return self.reply_rate * self.meeting_book_rate * self.show_rate * self.close_rate

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Scenario":
        return cls(
            target_profit=_safe_float(data.get("target_profit"), cls.target_profit),
            days=int(_safe_float(data.get("days"), cls.days)),
            setup_fee=_safe_float(data.get("setup_fee"), cls.setup_fee),
            upfront_collection_ratio=_safe_percent(
                data.get("upfront_collection_ratio"), cls.upfront_collection_ratio
            ),
            monthly_retainer=_safe_float(data.get("monthly_retainer"), cls.monthly_retainer),
            outreach_per_day=int(_safe_float(data.get("outreach_per_day"), cls.outreach_per_day)),
            reply_rate=_safe_percent(data.get("reply_rate"), cls.reply_rate),
            meeting_book_rate=_safe_percent(data.get("meeting_book_rate"), cls.meeting_book_rate),
            show_rate=_safe_percent(data.get("show_rate"), cls.show_rate),
            close_rate=_safe_percent(data.get("close_rate"), cls.close_rate),
            referral_deals=int(_safe_float(data.get("referral_deals"), cls.referral_deals)),
            ad_budget=_safe_float(data.get("ad_budget"), cls.ad_budget),
            contractor_cost=_safe_float(data.get("contractor_cost"), cls.contractor_cost),
            software_cost=_safe_float(data.get("software_cost"), cls.software_cost),
        )

    @classmethod
    def from_json(cls, path: str | Path) -> "Scenario":
        payload = json.loads(Path(path).read_text(encoding="utf-8"))
        return cls.from_dict(payload)


@dataclass
class Lead:
    company: str
    niche: str
    city: str
    monthly_leads: float
    avg_ticket: float
    no_show_rate: float
    speed_to_lead_minutes: float
    google_reviews: float
    website_quality: float

    @classmethod
    def from_row(cls, row: Dict[str, Any]) -> "Lead":
        return cls(
            company=str(row.get("company", "")).strip(),
            niche=str(row.get("niche", "")).strip(),
            city=str(row.get("city", "")).strip(),
            monthly_leads=_safe_float(row.get("monthly_leads"), 0.0),
            avg_ticket=_safe_float(row.get("avg_ticket"), 0.0),
            no_show_rate=_safe_percent(row.get("no_show_rate"), 0.0),
            speed_to_lead_minutes=_safe_float(row.get("speed_to_lead_minutes"), 0.0),
            google_reviews=_safe_float(row.get("google_reviews"), 0.0),
            website_quality=_safe_float(row.get("website_quality"), 5.0),
        )


def build_funnel(scenario: Scenario) -> Dict[str, Any]:
    if scenario.cash_collected_per_deal <= 0:
        raise ValueError("setup_fee * upfront_collection_ratio must be positive.")
    if scenario.days <= 0:
        raise ValueError("days must be positive.")

    required_deals = _ceil_div(scenario.target_profit + scenario.fixed_costs, scenario.cash_collected_per_deal)
    deals_from_referrals = min(max(scenario.referral_deals, 0), required_deals)
    deals_from_outbound = max(0, required_deals - deals_from_referrals)

    shows_needed = _ceil_div(deals_from_outbound, scenario.close_rate)
    meetings_booked_needed = _ceil_div(shows_needed, scenario.show_rate)
    replies_needed = _ceil_div(meetings_booked_needed, scenario.meeting_book_rate)
    outreach_needed = _ceil_div(replies_needed, scenario.reply_rate)

    expected_cash = required_deals * scenario.cash_collected_per_deal
    expected_profit = expected_cash - scenario.fixed_costs

    return {
        "required_deals": required_deals,
        "deals_from_referrals": deals_from_referrals,
        "deals_from_outbound": deals_from_outbound,
        "shows_needed": shows_needed,
        "meetings_booked_needed": meetings_booked_needed,
        "replies_needed": replies_needed,
        "outreach_needed": outreach_needed,
        "daily_outreach_target": _ceil_div(outreach_needed, scenario.days),
        "daily_reply_target": _ceil_div(replies_needed, scenario.days),
        "daily_meeting_target": _ceil_div(meetings_booked_needed, scenario.days),
        "daily_show_target": _ceil_div(shows_needed, scenario.days),
        "daily_close_target": _ceil_div(required_deals, scenario.days),
        "expected_cash_collected": expected_cash,
        "expected_profit": expected_profit,
        "fixed_costs": scenario.fixed_costs,
        "cash_collected_per_deal": scenario.cash_collected_per_deal,
    }


def simulate_profit_outcomes(scenario: Scenario, runs: int = 5_000, seed: int = 42) -> Dict[str, float]:
    if runs <= 0:
        raise ValueError("runs must be positive.")

    rng = random.Random(seed)
    total_outreach = scenario.outreach_per_day * scenario.days
    p_close = scenario.outreach_to_close_rate

    profits: List[float] = []
    deals_closed: List[int] = []

    for _ in range(runs):
        deals = max(scenario.referral_deals, 0)
        for _ in range(total_outreach):
            if rng.random() < p_close:
                deals += 1
        profit = (deals * scenario.cash_collected_per_deal) - scenario.fixed_costs
        deals_closed.append(deals)
        profits.append(profit)

    sorted_profits = sorted(profits)
    success_count = sum(1 for amount in profits if amount >= scenario.target_profit)

    return {
        "runs": runs,
        "success_probability": success_count / runs,
        "mean_profit": sum(profits) / runs,
        "p10_profit": _quantile(sorted_profits, 0.10),
        "p50_profit": _quantile(sorted_profits, 0.50),
        "p90_profit": _quantile(sorted_profits, 0.90),
        "min_profit": sorted_profits[0],
        "max_profit": sorted_profits[-1],
        "mean_deals": sum(deals_closed) / runs,
    }


def load_leads(path: str | Path) -> List[Lead]:
    leads: List[Lead] = []
    with Path(path).open("r", encoding="utf-8", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            leads.append(Lead.from_row(row))
    return leads


def _lead_metrics(lead: Lead) -> Dict[str, float]:
    revenue_base = lead.monthly_leads * lead.avg_ticket
    recoverable_from_no_show = revenue_base * lead.no_show_rate
    speed_penalty = max(lead.speed_to_lead_minutes - 5.0, 0.0)
    website_penalty = max(8.5 - lead.website_quality, 0.0)
    review_gap = max(150.0 - lead.google_reviews, 0.0)

    # Score is built for prioritization, not scientific precision.
    score = (
        recoverable_from_no_show * 0.60
        + revenue_base * 0.20
        + speed_penalty * 140.0
        + website_penalty * 900.0
        + review_gap * 35.0
    )
    recoverable_total = recoverable_from_no_show + (revenue_base * 0.10)

    return {
        "score": score,
        "recoverable_monthly_revenue": recoverable_total,
        "revenue_base": revenue_base,
    }


def rank_leads(leads: Iterable[Lead]) -> List[Dict[str, Any]]:
    rankings: List[Dict[str, Any]] = []
    for lead in leads:
        metrics = _lead_metrics(lead)
        rankings.append(
            {
                "lead": lead,
                "score": metrics["score"],
                "recoverable_monthly_revenue": metrics["recoverable_monthly_revenue"],
                "revenue_base": metrics["revenue_base"],
            }
        )
    rankings.sort(key=lambda item: item["score"], reverse=True)
    return rankings


def _outreach_message(lead: Lead, recoverable_monthly_revenue: float) -> str:
    recoverable = _currency(recoverable_monthly_revenue)
    return (
        f"### {lead.company} ({lead.niche}, {lead.city})\n\n"
        f"**Subject:** Found hidden revenue for {lead.company}\n\n"
        f"Hi {lead.company} team,\n\n"
        f"I reviewed your lead flow in {lead.city} and estimate there is roughly **{recoverable}/month** "
        "being lost from delayed speed-to-lead and no-show leakage.\n\n"
        "I run a 14-day AI deployment that does three things quickly:\n"
        "1. Instant lead response (SMS + email + call routing)\n"
        "2. AI appointment confirmation and no-show prevention\n"
        "3. Missed-call text back + dormant lead reactivation\n\n"
        "Most teams get ROI in week one because appointments recover immediately.\n\n"
        "Open to a 15-minute teardown this week? I can map your current leak points and show "
        "the exact dollars recoverable before you commit.\n\n"
        "- [Your Name]\n\n"
        "**Follow-up DM (48h):**\n"
        f'"Quick bump: if {lead.company} recovered even half of the estimated {recoverable}/month, '
        'the deployment would pay for itself quickly. Want the 1-page ROI map?"\n\n'
        "**Call opener:**\n"
        f'"I called because {lead.company} likely has avoidable appointment leakage. If I can show a '
        'same-week recovery path in 10 minutes, is it worth a quick conversation?"\n'
    )


def generate_outreach_assets(rankings: Sequence[Dict[str, Any]], top: int = 10) -> str:
    selected = list(rankings[: max(0, top)])
    blocks: List[str] = [
        "# Personalized Outreach Assets",
        "",
        "Use these drafts as first-pass copy. Replace [Your Name] and include a calendar link.",
        "",
    ]
    for index, item in enumerate(selected, start=1):
        lead: Lead = item["lead"]
        blocks.append(f"## Lead {index}")
        blocks.append("")
        blocks.append(_outreach_message(lead, item["recoverable_monthly_revenue"]))
        blocks.append("")
    return "\n".join(blocks).strip() + "\n"


def render_execution_plan(scenario: Scenario, funnel: Dict[str, Any]) -> str:
    day_actions: Dict[int, str] = {
        1: "Finalize niche list, refine offer, and preload 300+ leads into outreach queue.",
        2: "Launch outbound wave #1 and book first discovery calls.",
        3: "Run discovery calls, collect pain points, and send same-day proposals.",
        4: "Outbound wave #2 plus partner/referral outreach to agencies and consultants.",
        5: "Close first deals with deposit collection and onboarding kickoff.",
        6: "Push testimonials/case analogs in follow-up sequence and handle objections.",
        7: "Pipeline audit: remove low-intent leads and double down on high-score accounts.",
        8: "Outbound wave #3 with stronger ROI proof and limited capacity framing.",
        9: "Run second close sprint with bundled add-ons and annual prepay incentives.",
        10: "Referral day: ask existing buyers and partners for warm introductions.",
        11: "Follow-up blitz on all open proposals and no-response meetings.",
        12: "Close sprint #3, enforce offer deadline, collect final deposits.",
        13: "Recovery day for stalled deals, custom terms, and executive-level follow-up.",
        14: "Final close day, confirm collected cash, and prep delivery calendar.",
    }

    lines = [
        "# 14-Day Execution Plan",
        "",
        "## Numeric Targets",
        "",
        f"- Profit target: {_currency(scenario.target_profit)}",
        f"- Required signed deals: {funnel['required_deals']}",
        f"- Daily outreach target: {funnel['daily_outreach_target']}",
        f"- Daily meetings booked target: {funnel['daily_meeting_target']}",
        f"- Daily closes target: {funnel['daily_close_target']}",
        "",
        "## Daily Sprint",
        "",
    ]

    for day in range(1, scenario.days + 1):
        action = day_actions.get(day, "Execute full KPI loop: outreach, calls, proposals, closes.")
        lines.extend(
            [
                f"### Day {day}",
                f"- Primary action: {action}",
                f"- Non-negotiables: {funnel['daily_outreach_target']} outreach, "
                f"{funnel['daily_meeting_target']} meetings booked, "
                f"{funnel['daily_close_target']} closes",
                "- End-of-day review: update pipeline stage counts and conversion percentages.",
                "",
            ]
        )

    lines.extend(
        [
            "## Weekly Checkpoints",
            "",
            "- **End of Day 4:** At least 40% of required replies generated.",
            "- **End of Day 7:** At least 45% of required meetings booked.",
            "- **End of Day 10:** At least 60% of required closes secured.",
            "- **End of Day 14:** Target cash collected and signed onboarding schedule complete.",
            "",
        ]
    )

    return "\n".join(lines)


def format_funnel_report(scenario: Scenario, funnel: Dict[str, Any]) -> str:
    lines = [
        "ProfitPilot Funnel Report",
        "------------------------",
        f"Target profit: {_currency(scenario.target_profit)}",
        f"Execution days: {scenario.days}",
        f"Cash collected per deal: {_currency(funnel['cash_collected_per_deal'])}",
        f"Fixed costs: {_currency(funnel['fixed_costs'])}",
        "",
        f"Required signed deals: {funnel['required_deals']}",
        f"  - From referrals: {funnel['deals_from_referrals']}",
        f"  - From outbound: {funnel['deals_from_outbound']}",
        "",
        f"Shows needed: {funnel['shows_needed']}",
        f"Meetings booked needed: {funnel['meetings_booked_needed']}",
        f"Replies needed: {funnel['replies_needed']}",
        f"Outreach needed: {funnel['outreach_needed']}",
        "",
        "Daily KPI targets",
        f"  - Outreach/day: {funnel['daily_outreach_target']}",
        f"  - Replies/day: {funnel['daily_reply_target']}",
        f"  - Meetings/day: {funnel['daily_meeting_target']}",
        f"  - Shows/day: {funnel['daily_show_target']}",
        f"  - Closes/day: {funnel['daily_close_target']}",
        "",
        f"Projected cash collected: {_currency(funnel['expected_cash_collected'])}",
        f"Projected profit: {_currency(funnel['expected_profit'])}",
    ]
    return "\n".join(lines)


def format_simulation_report(summary: Dict[str, float]) -> str:
    lines = [
        "ProfitPilot Monte Carlo Simulation",
        "---------------------------------",
        f"Simulation runs: {int(summary['runs'])}",
        f"Success probability: {summary['success_probability'] * 100:.1f}%",
        f"Average deals closed: {summary['mean_deals']:.2f}",
        f"Mean profit: {_currency(summary['mean_profit'])}",
        f"P10 profit: {_currency(summary['p10_profit'])}",
        f"P50 profit: {_currency(summary['p50_profit'])}",
        f"P90 profit: {_currency(summary['p90_profit'])}",
        f"Min profit: {_currency(summary['min_profit'])}",
        f"Max profit: {_currency(summary['max_profit'])}",
    ]
    return "\n".join(lines)


def format_lead_rankings(rankings: Sequence[Dict[str, Any]], top: int = 10) -> str:
    lines = [
        "Top Lead Opportunities",
        "----------------------",
        "Rank | Company | Niche | Score | Recoverable Monthly Revenue",
        "---- | ------- | ----- | ----- | ---------------------------",
    ]
    for idx, item in enumerate(rankings[: max(0, top)], start=1):
        lead: Lead = item["lead"]
        lines.append(
            f"{idx} | {lead.company} | {lead.niche} | {item['score']:.0f} | "
            f"{_currency(item['recoverable_monthly_revenue'])}"
        )
    return "\n".join(lines)

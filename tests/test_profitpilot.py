import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from profitpilot.core import Lead, Scenario, build_funnel, rank_leads, simulate_profit_outcomes


class ProfitPilotTests(unittest.TestCase):
    def test_build_funnel_default_requirements(self) -> None:
        scenario = Scenario()
        funnel = build_funnel(scenario)
        self.assertEqual(funnel["required_deals"], 11)
        self.assertEqual(funnel["deals_from_referrals"], 2)
        self.assertEqual(funnel["deals_from_outbound"], 9)
        self.assertEqual(funnel["daily_close_target"], 1)

    def test_percent_parsing_in_from_dict(self) -> None:
        scenario = Scenario.from_dict(
            {
                "upfront_collection_ratio": "75%",
                "reply_rate": "8%",
                "meeting_book_rate": "30%",
                "show_rate": "70%",
                "close_rate": "20%",
            }
        )
        self.assertAlmostEqual(scenario.upfront_collection_ratio, 0.75)
        self.assertAlmostEqual(scenario.reply_rate, 0.08)
        self.assertAlmostEqual(scenario.meeting_book_rate, 0.30)
        self.assertAlmostEqual(scenario.show_rate, 0.70)
        self.assertAlmostEqual(scenario.close_rate, 0.20)

    def test_simulation_all_success_when_probabilities_are_one(self) -> None:
        scenario = Scenario(
            target_profit=500,
            days=1,
            setup_fee=100,
            upfront_collection_ratio=1.0,
            outreach_per_day=10,
            reply_rate=1.0,
            meeting_book_rate=1.0,
            show_rate=1.0,
            close_rate=1.0,
            referral_deals=0,
            ad_budget=0.0,
            contractor_cost=0.0,
            software_cost=0.0,
        )
        summary = simulate_profit_outcomes(scenario, runs=100, seed=1)
        self.assertEqual(summary["success_probability"], 1.0)
        self.assertEqual(summary["mean_deals"], 10.0)

    def test_rank_leads_orders_by_score_descending(self) -> None:
        high = Lead(
            company="High Co",
            niche="Dental",
            city="Austin",
            monthly_leads=500,
            avg_ticket=3000,
            no_show_rate=0.25,
            speed_to_lead_minutes=20,
            google_reviews=40,
            website_quality=5.5,
        )
        low = Lead(
            company="Low Co",
            niche="Dental",
            city="Austin",
            monthly_leads=120,
            avg_ticket=1000,
            no_show_rate=0.10,
            speed_to_lead_minutes=5,
            google_reviews=180,
            website_quality=9.0,
        )
        rankings = rank_leads([low, high])
        self.assertEqual(rankings[0]["lead"].company, "High Co")
        self.assertEqual(rankings[1]["lead"].company, "Low Co")


if __name__ == "__main__":
    unittest.main()

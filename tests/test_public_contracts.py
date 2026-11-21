import math
import unittest

from core_alpha_stub import MarketContext, PortfolioIntent


class PublicContractBoundaryTests(unittest.TestCase):
    def test_market_context_accepts_finite_observations(self):
        context = MarketContext("2026-11-20T00:00:00Z", {"equity": 0.0, "rate": -0.25})
        self.assertEqual(context.observations["equity"], 0.0)

    def test_market_context_rejects_non_finite_observations(self):
        for value in (math.nan, math.inf, -math.inf, True, "nan"):
            with self.subTest(value=value), self.assertRaisesRegex(ValueError, "finite number"):
                MarketContext("2026-11-20T00:00:00Z", {"equity": value})

    def test_portfolio_intent_accepts_finite_targets(self):
        intent = PortfolioIntent("2026-11-20T00:00:00Z", {"BTC": 0.35, "CASH": 0.0})
        self.assertEqual(intent.targets["BTC"], 0.35)

    def test_portfolio_intent_rejects_non_finite_targets(self):
        for value in (math.nan, math.inf, -math.inf, False, None):
            with self.subTest(value=value), self.assertRaisesRegex(ValueError, "finite number"):
                PortfolioIntent("2026-11-20T00:00:00Z", {"BTC": value})


if __name__ == "__main__":
    unittest.main()

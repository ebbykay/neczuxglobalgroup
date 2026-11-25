import unittest
from decimal import Decimal
from commercial.pricing import estimate, profitability, break_even

class PricingTests(unittest.TestCase):
    def test_example(self):
        self.assertEqual(estimate("10","40","100",contingency="50")["minimum_price"],Decimal("785.72"))
    def test_round_up(self):
        self.assertEqual(estimate("1","1",margin="0.30")["minimum_price"],Decimal("1.43"))
    def test_zero_margin(self):
        self.assertEqual(estimate("2","10",margin="0")["minimum_price"],Decimal("20"))
    def test_loss(self):
        self.assertEqual(profitability("100","120")["margin_percent"],Decimal("-20"))
    def test_zero_revenue(self):
        self.assertIsNone(profitability("0","10")["margin_percent"])
    def test_break_even(self):
        self.assertEqual(break_even("1000","500","200"),4)
    def test_no_contribution(self):
        with self.assertRaises(ValueError): break_even("100","50","50")
    def test_invalid_inputs(self):
        for v in ("NaN","Infinity","-1","0.00001","bad",1.2):
            with self.subTest(v=v),self.assertRaises(ValueError): estimate(v,"40")
    def test_invalid_margin(self):
        with self.assertRaises(ValueError): estimate("1","40",margin="1")
    def test_fractional_pesewa(self):
        with self.assertRaises(ValueError): profitability("1.001","1")

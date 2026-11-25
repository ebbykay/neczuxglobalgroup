import unittest
from decimal import Decimal
from commercial.planning import Month,project,scenarios
class PlanningTests(unittest.TestCase):
    def test_collection(self):
        r=project("100",[Month("1000","200","300")]*2)
        self.assertEqual(r[0]["collected"],Decimal("700"))
        self.assertEqual(r[1]["collected"],Decimal("1000"))
        self.assertEqual(r[1]["receivables"],Decimal("300"))
    def test_cash(self):
        r=project("100",[Month("1000","200","300","50","20","10")])
        self.assertEqual(r[0]["closing_cash"],Decimal("260"))
        self.assertEqual(r[0]["operating_surplus"],Decimal("500"))
    def test_gap(self):
        self.assertEqual(project("0",[Month("0","100","200")])[0]["funding_gap"],Decimal("300"))
    def test_opening_receivable(self):
        self.assertEqual(project("0",[Month("0","0","0")],opening_receivables="250")[0]["collected"],Decimal("250"))
    def test_zero_collection(self):
        r=project("0",[Month("100","0","0")]*2,"0")
        self.assertEqual(r[1]["collected"],Decimal("100"))
    def test_rounding(self):
        r=project("0",[Month("0.01","0","0")],"0.5")[0]
        self.assertEqual(r["collected"]+r["receivables"],r["billed"])
    def test_scenarios(self):
        r=scenarios("0",[Month("100","0","0")])
        self.assertEqual([x["months"][0]["closing_cash"] for x in r],[Decimal("40"),Decimal("70"),Decimal("100")])
    def test_invalid_rate(self):
        with self.assertRaises(ValueError): project("0",[Month("0","0","0")],"1.1")
    def test_invalid_money(self):
        with self.assertRaises(ValueError): project("0",[Month("0.001","0","0")])
    def test_empty(self):
        with self.assertRaises(ValueError): project("0",[])

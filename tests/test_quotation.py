import unittest
from datetime import date
from decimal import Decimal
from dataclasses import FrozenInstanceError
from commercial.quotation import Line,draft,customer_view

class QuoteTests(unittest.TestCase):
    def make(self,**kwargs):
        args=dict(reference="DEMO-1",scope="Reporting pilot",exclusions="Hosting",acceptance_criteria="Report reconciles",issued=date(2026,11,25),expires=date(2026,12,5),lines=[Line("Build","10","40","100",contingency="50")])
        args.update(kwargs)
        return draft(**args)
    def test_price(self):
        q=self.make()
        self.assertEqual(q.price,Decimal("785.72"))
        self.assertEqual(q.profit,Decimal("235.72"))
    def test_multiple_lines(self):
        q=self.make(lines=[Line("A","1","100"),Line("B","1","100")])
        self.assertEqual(q.price,Decimal("285.72"))
    def test_customer_view(self):
        v=customer_view(self.make())
        self.assertNotIn("cost",v)
        self.assertNotIn("profit",v)
        self.assertEqual(v["deliverables"],["Build"])
        self.assertEqual(v["status"],"draft")
    def test_immutable(self):
        q=self.make()
        with self.assertRaises(FrozenInstanceError): q.price=Decimal("1")
    def test_empty(self):
        with self.assertRaises(ValueError): self.make(lines=[])
    def test_expiry(self):
        with self.assertRaises(ValueError): self.make(expires=date(2020,1,1))
    def test_missing_scope(self):
        with self.assertRaises(ValueError): self.make(scope=" ")
    def test_zero_cost(self):
        with self.assertRaises(ValueError): self.make(lines=[Line("A","0","0")])
    def test_margin(self):
        with self.assertRaises(ValueError): self.make(margin="1")

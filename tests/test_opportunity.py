import unittest
from commercial.opportunity import Evidence,WEIGHTS,assess

class OpportunityTests(unittest.TestCase):
    def full(self,n=5): return {k:Evidence(n,"Synthetic interview evidence") for k in WEIGHTS}
    def test_weights(self): self.assertEqual(sum(WEIGHTS.values()),100)
    def test_priority(self): self.assertEqual(assess(self.full())["status"],"priority")
    def test_missing(self):
        x=assess({"pain":Evidence(5,"Synthetic")})
        self.assertEqual((x["score_lower"],x["score_upper"],x["coverage_percent"],x["status"]),(25,100,25,"research"))
    def test_empty(self): self.assertEqual(assess({})["score_upper"],100)
    def test_budget_gate(self):
        e=self.full();e["budget"]=Evidence(1,"Budget not confirmed")
        self.assertEqual(assess(e)["status"],"qualify")
    def test_authority_gate(self):
        e=self.full();e["authority"]=Evidence(0,"No decision owner")
        self.assertEqual(assess(e)["status"],"qualify")
    def test_blocked(self): self.assertEqual(assess(self.full(),lawful=False)["status"],"blocked")
    def test_infeasible(self): self.assertEqual(assess(self.full(),feasible=False)["status"],"blocked")
    def test_defer(self): self.assertEqual(assess(self.full(1))["status"],"defer")
    def test_invalid(self):
        for v in (Evidence(True,"x"),Evidence(6,"x"),Evidence(3," ")):
            with self.assertRaises(ValueError): assess({"pain":v})
    def test_unknown(self):
        with self.assertRaises(ValueError): assess({"age":Evidence(3,"x")})

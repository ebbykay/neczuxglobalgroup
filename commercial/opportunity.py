"""Transparent, provisional opportunity triage; not a predictive model."""
from dataclasses import dataclass
from fractions import Fraction

WEIGHTS = {"pain":25,"budget":25,"authority":15,"urgency":10,"fit":15,"repeatability":10}

@dataclass(frozen=True)
class Evidence:
    score: int
    basis: str

def assess(evidence, *, lawful=True, feasible=True):
    if type(lawful) is not bool or type(feasible) is not bool:
        raise ValueError("Gate flags must be boolean")
    if not isinstance(evidence,dict) or not set(evidence)<=set(WEIGHTS):
        raise ValueError("Unknown criteria")
    for item in evidence.values():
        if type(item) is not Evidence or type(item.score) is not int or not 0<=item.score<=5 or not isinstance(item.basis,str) or not item.basis.strip() or len(item.basis)>1000:
            raise ValueError("Evidence requires score 0–5 and a documented basis")
    covered=sum(WEIGHTS[k] for k in evidence)
    score=sum((Fraction(WEIGHTS[k]*v.score,5) for k,v in evidence.items()),Fraction(0))
    upper=score+100-covered
    if not lawful or not feasible: status="blocked"
    elif covered<100: status="research"
    elif evidence["budget"].score<2 or evidence["authority"].score<2: status="qualify"
    elif score>=75: status="priority"
    elif score>=50: status="qualify"
    else: status="defer"
    return {"score_lower":float(score),"score_upper":float(upper),"coverage_percent":covered,"status":status}

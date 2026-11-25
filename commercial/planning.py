"""Deterministic monthly GHS cash planning, not statistical forecasts."""
from dataclasses import dataclass
from decimal import Decimal, localcontext, ROUND_HALF_UP
from commercial.pricing import number
CENT=Decimal("0.01")
def money(v):
    n=number(v)
    if n!=n.quantize(CENT): raise ValueError("Pesewa precision required")
    return n

@dataclass(frozen=True)
class Month:
    billed: str
    variable_cost: str
    fixed_cost: str
    capital_spend: str="0"
    other_cash_in: str="0"
    other_cash_out: str="0"

def project(opening_cash, months, collection_current="0.70", opening_receivables="0"):
    if not isinstance(months,(tuple,list)) or not 1<=len(months)<=60:
        raise ValueError("One to 60 months required")
    with localcontext() as ctx:
        ctx.prec=40
        cash=money(opening_cash)
        receivable=money(opening_receivables)
        rate=number(collection_current)
        if rate>1: raise ValueError("Collection fraction must be 0–1")
        rows=[]
        for i,m in enumerate(months,1):
            if type(m) is not Month: raise ValueError("Invalid month")
            billed,var,fixed,cap,other_in,other_out=map(money,(m.billed,m.variable_cost,m.fixed_cost,m.capital_spend,m.other_cash_in,m.other_cash_out))
            current=(billed*rate).quantize(CENT,rounding=ROUND_HALF_UP)
            collected=receivable+current
            receivable=billed-current
            operating_profit=billed-var-fixed
            net_cash=collected+other_in-var-fixed-cap-other_out
            cash+=net_cash
            rows.append({"month":i,"billed":billed,"collected":collected,"operating_surplus":operating_profit,"net_cash":net_cash,"closing_cash":cash,"receivables":receivable,"funding_gap":max(Decimal("0"),-cash)})
        return rows

def scenarios(opening_cash, months, rates=("0.40","0.70","1.00"), opening_receivables="0"):
    if not isinstance(rates,(list,tuple)) or not 1<=len(rates)<=20: raise ValueError("Invalid scenarios")
    return [{"collection_fraction":r,"months":project(opening_cash,months,r,opening_receivables)} for r in rates]

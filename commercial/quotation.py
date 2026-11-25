"""Synthetic, immutable quotation drafts; no delivery or acceptance authority."""
from dataclasses import dataclass
from datetime import date
from decimal import Decimal, localcontext
from commercial.pricing import estimate, number

def clean(value, limit):
    if not isinstance(value,str) or not value.strip() or len(value.strip())>limit:
        raise ValueError("Invalid text")
    return value.strip()

@dataclass(frozen=True)
class Line:
    description: str
    hours: str
    hourly_cost: str
    external: str = "0"
    overhead: str = "0"
    contingency: str = "0"

@dataclass(frozen=True)
class Quote:
    reference: str
    scope: str
    exclusions: str
    acceptance_criteria: str
    issued: date
    expires: date
    lines: tuple
    cost: Decimal
    price: Decimal
    profit: Decimal
    currency: str = "GHS"

def draft(reference, scope, exclusions, acceptance_criteria, issued, expires, lines, margin="0.30"):
    if type(issued) is not date or type(expires) is not date or expires < issued:
        raise ValueError("Invalid validity dates")
    reference,scope,exclusions,acceptance_criteria = (clean(reference,100),clean(scope,4000),clean(exclusions,4000),clean(acceptance_criteria,4000))
    if not isinstance(lines,(list,tuple)) or not 1 <= len(lines) <= 100:
        raise ValueError("One to 100 lines required")
    m=number(margin)
    if m>=1: raise ValueError("Invalid margin")
    with localcontext() as ctx:
        ctx.prec=40
        costs=[]
        for line in lines:
            if type(line) is not Line: raise ValueError("Invalid line")
            clean(line.description,500)
            costs.append(estimate(line.hours,line.hourly_cost,line.external,line.overhead,line.contingency,margin="0")["cost"])
        cost=sum(costs,Decimal("0"))
        if not cost: raise ValueError("Positive cost required")
        from decimal import ROUND_CEILING
        price=(cost/(1-m)).quantize(Decimal("0.01"),rounding=ROUND_CEILING)
        return Quote(reference,scope,exclusions,acceptance_criteria,issued,expires,tuple(lines),cost,price,price-cost)

def customer_view(quote):
    """Exclude internal cost assumptions and profit from customer-facing output."""
    return {"reference":quote.reference,"scope":quote.scope,"exclusions":quote.exclusions,
            "acceptance_criteria":quote.acceptance_criteria,"issued":quote.issued.isoformat(),
            "expires":quote.expires.isoformat(),"deliverables":[line.description for line in quote.lines],
            "price":str(quote.price),"currency":quote.currency,"status":"draft",
            "tax_note":"Applicable taxes and payment terms require confirmation before issue."}

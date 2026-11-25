"""Pure GHS pricing calculations; no customer data or approved rates."""
from decimal import Decimal, ROUND_CEILING, ROUND_HALF_UP, localcontext
CENT = Decimal("0.01")
MAX = Decimal("1000000000")

def number(value):
    if not isinstance(value, str):
        raise ValueError("Use decimal strings")
    try:
        n = Decimal(value)
    except ArithmeticError as exc:
        raise ValueError("Invalid decimal") from exc
    if not n.is_finite() or n < 0 or n > MAX or n.as_tuple().exponent < -4:
        raise ValueError("Out of range or excessive precision")
    return n

def estimate(hours, hourly_cost, external="0", overhead="0", contingency="0", margin="0.30"):
    with localcontext() as ctx:
        ctx.prec = 40
        h, rate, ext, ov, reserve, m = map(number, (hours, hourly_cost, external, overhead, contingency, margin))
        if m >= 1:
            raise ValueError("Margin must be below one")
        cost = (h * rate + ext + ov + reserve).quantize(CENT, rounding=ROUND_CEILING)
        price = (cost / (1-m)).quantize(CENT, rounding=ROUND_CEILING)
        return {"cost": cost, "minimum_price": price, "estimated_profit": price-cost}

def profitability(price, cost):
    with localcontext() as ctx:
        ctx.prec = 40
        p,c = map(number,(price,cost))
        if p != p.quantize(CENT) or c != c.quantize(CENT):
            raise ValueError("Money requires pesewa precision")
        return {"profit":p-c,"margin_percent":((p-c)/p*100).quantize(CENT,rounding=ROUND_HALF_UP) if p else None}

def break_even(fixed_cost, price, variable_cost):
    with localcontext() as ctx:
        ctx.prec = 40
        f,p,v = map(number,(fixed_cost,price,variable_cost))
        if p <= v:
            raise ValueError("Positive contribution required")
        return int((f/(p-v)).to_integral_value(rounding=ROUND_CEILING))

# Website evolution — foundation audit

Baseline: 88f8dd17abaf34fdba54eabfb5276e21e789821f (main), reviewed 25 November 2026.

## Direction
Preserve Vision Meets Venture and Integrated Business & Technology Builder. Proposed five divisions: Strategy, Systems, Studio, Academy, Network & Store. Preserve existing public Growth Loop wording pending owner approval of any refinement. Confirm legal entity wording and service capacity before release.

## Findings
- P0: browser-side Airtable token instructions are unsafe; remove disabled integration and use a server-side intermediary if needed. No active token observed.
- P0: newsletter ignores HTTP failure; correct response handling. Contact and newsletter endpoint ownership and delivery remain unverified.
- P0: homepage performance claims, testimonials and case studies need evidence; product stock, delivery and savings claims need verification. Replace unsupported content with factual offerings or labelled demonstrations.
- P0: privacy policy describes Airtable storage although browser integration is disabled; confirm actual processing, retention and applicable Ghana data protection requirements.
- P1: missing blog, case studies and image assets; validate all local references.
- P1: sitemap and metadata reference custom domain; use verified production address.
- P1: placeholder analytics; disable until valid property and consent configuration exist.
- P1: both checked-in deployment workflows target master, not main; recent Pages deployments succeeded. Confirm Pages source before changing workflows.
- P2: repeated markup and inline styles; progressively extract shared templates.

## Architecture and sitemap
Retain static HTML/CSS/JS and GitHub Pages. Home, About, Divisions, Services & Packages, Portfolio, Academy, Store, Insights, Contact, legal pages. Reuse existing URLs where possible. Store starts as sourcing/quotation, not checkout. Formspree remains provisional pending delivery test; CRM integration must keep credentials server-side. No paid services without approval.

## Milestones (target, not guaranteed)
- Nov 25–28: audit, critical fixes, documentation and baseline checks.
- Nov 29–Dec 5: division architecture, shared design system.
- Dec 6–12: public pages and service packages.
- Dec 13–19: quote, procurement, consultation and training requests; lead tracking.
- Dec 20–26: verified portfolio, SEO, accessibility and testing.
- Dec 27–30: acceptance testing and release readiness; target launch Dec 31.

## Release gates
No broken internal links or missing referenced local assets; JavaScript syntax check passes; mobile and desktop browser tests; keyboard navigation and contrast review; verified form delivery and error paths; owner-approved service catalogue and evidence; accurate privacy notice; deployment and rollback documented. No live submission tests without owner approval. No invented client evidence or stock guarantees. Advanced CRM, payments and client portal are deferred until demand and operating capacity justify them.

# Neczux OS v0.1 — requirements baseline
Owner: Neczux; approval pending. Scope: internal lead-to-cash workflow, single organisation, authorised staff. Excludes payment processing, AI, multi-tenancy and public customer accounts.
| ID | Requirement | Acceptance criterion |
|---|---|---|
| R01 | Authenticate staff | Unauthenticated requests denied |
| R02 | Authorise roles | Staff cannot perform restricted finance/admin actions |
| R03 | Register leads | Valid contact and requirements persisted with unique ID |
| R04 | Qualify and quote | Quote has currency, line items, validity and version |
| R05 | Accept quotation | Accepted version immutable; engagement linked |
| R06 | Manage projects | Engagement has owner, milestones and status |
| R07 | Invoice | Invoice references engagement; totals exact |
| R08 | Record payment | Positive amount, currency, reference; no duplicate reference; no overpayment without approved policy |
| R09 | Audit changes | Actor, time, action and entity recorded |
| R10 | Backup and restore | Restore tested on synthetic dataset |
| R11 | Report financial position | Invoiced, collected and outstanding distinguished |
Nonfunctional: least privilege, server-side validation, transactional writes, decimal monetary arithmetic, accessible interface, documented recovery, no secrets in repository. Performance and retention targets require owner approval.

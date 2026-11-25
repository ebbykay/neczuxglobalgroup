# Neczux Global Group

Vision Meets Venture — Integrated Business & Technology Builder.

Public website: https://ebbykay.github.io/neczuxglobalgroup/

## Development
The current site is static HTML, CSS and JavaScript. From the repository root run `python3 -m http.server 8000` and open http://localhost:8000/. No paid dependencies are required.

Run `python3 tests/check_site.py` and `node --check scripts/main.js` before proposing changes. The initial link audit may report existing defects; resolve them before release.

Use feature branches and pull requests. Do not deploy unreviewed changes to main. GitHub Pages remains the default hosting arrangement. Verify actual Pages settings before modifying deployment workflows.

Never place API credentials in browser code. Verify form routing with the business owner before launch. Do not publish unsupported claims or customer information.

See [development plan](docs/development-plan.md) for scope, risks and acceptance gates.

## Engineering documentation
See the [engineering documentation index](docs/engineering/README.md) and [enterprise roadmap](docs/enterprise-roadmap.md). The internal OS is not yet implemented.

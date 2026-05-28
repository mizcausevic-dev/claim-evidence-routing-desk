# Claim Evidence Routing Desk

[![CI](https://github.com/mizcausevic-dev/claim-evidence-routing-desk/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/claim-evidence-routing-desk/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](./.github/dependabot.yml)
[![Deploy](https://github.com/mizcausevic-dev/claim-evidence-routing-desk/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/claim-evidence-routing-desk/actions/workflows/pages.yml)

TypeScript control plane for insurance claims intake, missing evidence packets, denial pressure, and appeal-safe routing across payer operations.

## Why this exists

- Claims teams lose time when clinical proof, coding notes, appeal narratives, and payer deadlines live in separate systems.
- Denials often come from routing failures and incomplete packets, not from the absence of business context.
- Revenue cycle, appeals, utilization review, and eligibility desks all need the same packet picture without waiting on another spreadsheet.
- Insurance and InsurTech buyers care whether the claim workflow is auditable and recoverable, not whether the dashboard looks “AI-powered.”

## Why this matters (KG Embedded tie-back)

This repo demonstrates the evidence-routing primitive for Insurance / InsurTech buyers: claims tied to missing proof, stale packets, appeal blockers, and owner-safe escalation paths. A B2B SaaS buyer would care because claim routing and denial prevention often need to surface inside customer-facing operator tools without exposing unsafe payer systems or write-heavy backends. Kinetic Gain Embedded extends this into security-first in-product analytics for appeal-aware and evidence-aware reporting across claims and reimbursement operations, see [kineticgain.com/embedded](https://kineticgain.com/embedded).

## Routes

- `/`
- `/claim-lane`
- `/evidence-routing`
- `/appeal-posture`
- `/verification`
- `/docs`

## API

- `/api/dashboard/summary`
- `/api/claim-lane`
- `/api/evidence-routing`
- `/api/appeal-posture`
- `/api/verification`
- `/api/sample`

## Screenshots

![Overview](./screenshots/01-overview-proof.png)
![Claim lane](./screenshots/02-claim-lane-proof.png)
![Evidence routing](./screenshots/03-evidence-routing-proof.png)
![Appeal posture](./screenshots/04-appeal-posture-proof.png)

## Local Development

```powershell
cd claim-evidence-routing-desk
npm install
npm run dev
```

Open:
- [http://127.0.0.1:5522/](http://127.0.0.1:5522/)
- [http://127.0.0.1:5522/claim-lane](http://127.0.0.1:5522/claim-lane)
- [http://127.0.0.1:5522/evidence-routing](http://127.0.0.1:5522/evidence-routing)
- [http://127.0.0.1:5522/appeal-posture](http://127.0.0.1:5522/appeal-posture)
- [http://127.0.0.1:5522/verification](http://127.0.0.1:5522/verification)

## Validation

- `npm run build`
- `npm run test`
- `npm run demo`
- `npm run smoke`
- `npm run render:assets`

## Production status

| Aspect | Status |
|--------|--------|
| CI | Node 20 + 22 matrix — lint · typecheck · coverage · build · demo · smoke · `npm audit` ([workflow](./.github/workflows/ci.yml)) |
| Test coverage | `src/services/` coverage gate maintained via `vitest` |
| License | [AGPL-3.0-or-later](./LICENSE) |
| Dependencies | Dependabot weekly (npm + GitHub Actions); `npm audit --audit-level=high` in CI |
| Data handling | Synthetic, non-PHI claim packets only. No live member, payer, or reimbursement records. |
| Deploy | Static prerender → **https://claims.kineticgain.com/** (GitHub Pages, [pages workflow](./.github/workflows/pages.yml)) |

## Docs

- [Kinetic Gain Embedded tie-back](./docs/KINETIC_GAIN_EMBEDDED.md)
- [Changelog](./CHANGELOG.md)

## Part of the Kinetic Gain Suite

Operator surface in the [Kinetic Gain Suite](https://suite.kineticgain.com/) — a portfolio of buyer-readable control planes spanning security posture, compliance evidence, data-platform governance, FinOps, and operator workflows. Apex: [kineticgain.com](https://kineticgain.com/).

## Related surfaces

- [**`prior-authorization-evidence-router`**](https://github.com/mizcausevic-dev/prior-authorization-evidence-router) — healthcare approval evidence routing
- [**`regulatory-reporting-mart`**](https://github.com/mizcausevic-dev/regulatory-reporting-mart) — reporting and deadline operations
- [**`third-party-risk-evidence-ledger`**](https://github.com/mizcausevic-dev/third-party-risk-evidence-ledger) — vendor evidence and review posture

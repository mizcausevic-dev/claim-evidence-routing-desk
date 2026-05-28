# Changelog

## v1.0.0-prod — 2026-05-28
- Production hardening pass on Codex's v0.1-shipped scaffold. Confirmed CI + Pages workflow green on `main` at HEAD before tagging `v1.0-prod`.
- Codex's v2-era scaffold already carries the `## Production status` block, `## Part of the Kinetic Gain Suite` SEO footer, and `kineticgain.com/embedded` tie-back — confirmed unchanged, no narrative edits.
- Added `claims.kineticgain.com` to `procurement-pulse-engine/universe.csv` per the v2 repo-strategy "every deploy enters universe" rule (additive · non-fatal · doesn't block publish).
- Repo metadata previously polished mid-session (description + homepage + 11 topics including `control-plane`, `operator-surface`, `platform-engineering`).
- No `src/`, README narrative, docs, or screenshot edits — squad doctrine v1.1 respects the v0.1-shipped operator-surface as Codex shipped it.

## 0.1.0 - 2026-05-28

- initial public release of `claim-evidence-routing-desk`
- shipped insurance claims operator surface with claim lane, evidence routing, appeal posture, verification, and docs views
- added offline analyzer + CLI for synthetic claim packet exports
- published GitHub Pages deployment to `https://claims.kineticgain.com/`

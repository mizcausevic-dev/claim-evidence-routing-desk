// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  appealPosture,
  claimLane,
  evidenceRouting,
  payload,
  summary,
  verification
} from "./services/claimEvidenceRoutingDeskService.js";
import {
  renderAppealPosture,
  renderClaimLane,
  renderDocs,
  renderEvidenceRouting,
  renderOverview,
  renderValidation,
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5522);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/claim-lane", (_req, res) => res.type("html").send(renderClaimLane()));
app.get("/evidence-routing", (_req, res) => res.type("html").send(renderEvidenceRouting()));
app.get("/appeal-posture", (_req, res) => res.type("html").send(renderAppealPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderValidation()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/claim-lane", (_req, res) => res.json(claimLane()));
app.get("/api/evidence-routing", (_req, res) => res.json(evidenceRouting()));
app.get("/api/appeal-posture", (_req, res) => res.json(appealPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Claim Evidence Routing Desk listening on http://${host}:${port}`);
  });
}

export default app;

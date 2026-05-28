// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdir, writeFile } from "node:fs/promises";

import {
  appealPosture,
  claimLane,
  evidenceRouting,
  payload,
  summary,
  verification
} from "../src/services/claimEvidenceRoutingDeskService.js";
import {
  renderAppealPosture,
  renderClaimLane,
  renderDocs,
  renderEvidenceRouting,
  renderOverview,
  renderValidation
} from "../src/services/render.js";

async function writePage(route: string, html: string) {
  const directory = route === "/" ? "site" : `site${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html, "utf8");
}

async function writeJson(name: string, value: unknown) {
  await mkdir("site/api", { recursive: true });
  await writeFile(`site/api/${name}.json`, JSON.stringify(value, null, 2), "utf8");
}

await writePage("/", renderOverview());
await writePage("/claim-lane", renderClaimLane());
await writePage("/evidence-routing", renderEvidenceRouting());
await writePage("/appeal-posture", renderAppealPosture());
await writePage("/verification", renderValidation());
await writePage("/docs", renderDocs());

await writeJson("summary", summary());
await writeJson("claim-lane", claimLane());
await writeJson("evidence-routing", evidenceRouting());
await writeJson("appeal-posture", appealPosture());
await writeJson("verification", verification());
await writeJson("sample", payload());

// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  appealPosture,
  claimLane,
  evidenceRouting,
  summary
} from "../src/services/claimEvidenceRoutingDeskService.js";

console.log("claim-evidence-routing-desk demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`claim lanes: ${claimLane().length}`);
console.log(`evidence routing findings: ${evidenceRouting().length}`);
console.log(`appeal packets: ${appealPosture().length}`);

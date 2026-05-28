// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { appealPackets, claimLanePackets, sampleClaimEvidencePayload } from "../data/sampleClaims.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleClaimEvidencePayload, {
  now: NOW,
  staleDetectionAfterHours: 72
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    claims: report.claims,
    onTrackClaims: report.onTrackClaims,
    packets: report.packets,
    highSeverityPackets: report.highSeverityPackets,
    workflowGaps: report.workflowGaps,
    stalePackets: report.stalePackets,
    recommendation:
      "Restore missing clinical proof, close the appeal packet gaps, repair stale coverage evidence, and stabilize owner routing before the next payer deadlines."
  };
}

export function claimLane() {
  return claimLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "intake-lane") {
        return finding.code === "claim-evidence-gap" || finding.code === "workflow-gap";
      }
      if (lane.id === "clinical-lane") {
        return finding.code === "missing-clinical-proof" || finding.code === "stale-open-packet";
      }
      if (lane.id === "coding-lane") {
        return finding.code === "missing-coding-proof";
      }
      if (lane.id === "appeal-lane") {
        return finding.code === "missing-appeal-proof" || finding.code === "high-severity-unassigned";
      }
      return false;
    }).length
  }));
}

export function evidenceRouting() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "missing-clinical-proof"
          ? "Clinical Appeals RN"
          : finding.code === "missing-coding-proof"
            ? "Coding Review"
            : finding.code === "missing-appeal-proof"
              ? "Appeals Operations"
              : "Revenue Cycle Operations")
    }));
}

export function appealPosture() {
  return appealPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline claim-evidence analyzer and CLI, not static copy alone.",
    "Claims and evidence packets are synthetic sample data only; no PHI, payer feeds, or live reimbursement records are published.",
    "The control plane keeps missing proof, denial pressure, stale attachments, and appeal readiness visible for insurance and revenue-cycle stakeholders.",
    "This surface demonstrates claim evidence routing and appeal-safe sequencing, not a generic payer portal keyword page.",
    "It complements prior authorization, regulatory reporting, and vendor evidence operations with a reusable insurance-review primitive."
  ];
}

export const validation = verification;

export function payload() {
  return {
    summary: summary(),
    claimLane: claimLane(),
    evidenceRouting: evidenceRouting(),
    appealPosture: appealPosture(),
    verification: verification(),
    sample: sampleClaimEvidencePayload
  };
}

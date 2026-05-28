// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  AnalysisOptions,
  ClaimEvidenceExport,
  CoverageReport,
  EvidencePacket,
  Finding,
} from "./types.js";

function hoursBetween(startIso: string, endIso: string) {
  return Math.max(0, (Date.parse(endIso) - Date.parse(startIso)) / 36e5);
}

function hasOpenPacket(packets: EvidencePacket[], kind: string) {
  return packets.some((packet) => packet.kind === kind && packet.status === "OPEN");
}

export function analyze(
  payload: ClaimEvidenceExport,
  options: AnalysisOptions = {}
): CoverageReport {
  const now = options.now ?? new Date().toISOString();
  const staleAfterHours = options.staleDetectionAfterHours ?? 72;
  const findingsList: Finding[] = [];

  const onTrackClaims = payload.claims.filter((claim) => claim.status === "ON_TRACK").length;
  const highSeverityPackets = payload.packets.filter(
    (packet) => packet.status === "OPEN" && packet.severity === "high"
  ).length;
  const workflowGaps = payload.claims.filter((claim) => !claim.workflowHealthy).length;

  if (onTrackClaims === 0) {
    findingsList.push({
      code: "no-on-track-claims",
      severity: "high",
      subject: "workflow",
      subjectId: "claims",
      subjectName: "Claims routing workflow",
      message: "No claims are currently on track; the evidence queue is operating entirely in exception mode."
    });
  }

  for (const claim of payload.claims) {
    const claimPackets = payload.packets.filter((packet) => packet.claimId === claim.id && packet.status === "OPEN");

    if (claim.status === "AT_RISK" || claimPackets.length > 0) {
      findingsList.push({
        code: "claim-evidence-gap",
        severity: claim.status === "AT_RISK" ? "high" : "medium",
        subject: "claim",
        subjectId: claim.id,
        subjectName: `${claim.insurer} ${claim.id}`,
        owner: claim.owner,
        scope: claim.serviceLine,
        message: `${claim.insurer} claim ${claim.id} still has open evidence debt against the ${claim.packet} packet.`
      });
    }

    if (claimPackets.length > 0 && !hasOpenPacket(claimPackets, "Clinical")) {
      findingsList.push({
        code: "missing-clinical-proof",
        severity: "medium",
        subject: "claim",
        subjectId: claim.id,
        subjectName: `${claim.insurer} ${claim.id}`,
        owner: claim.owner,
        scope: claim.serviceLine,
        message: "The claim is in exception flow but does not currently show a clean clinical-evidence anchor in the routing queue."
      });
    }

    if (!claim.workflowHealthy) {
      findingsList.push({
        code: "workflow-gap",
        severity: "medium",
        subject: "workflow",
        subjectId: claim.id,
        subjectName: `${claim.insurer} ${claim.id}`,
        owner: claim.owner,
        scope: claim.serviceLine,
        message: "Owner-safe routing is degraded; the evidence packet and appeal sequence are still split across teams."
      });
    }
  }

  for (const packet of payload.packets) {
    if (packet.status !== "OPEN") continue;

    if (packet.kind === "Clinical") {
      findingsList.push({
        code: "missing-clinical-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.insurer} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.kind === "Coding") {
      findingsList.push({
        code: "missing-coding-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.insurer} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.kind === "Appeal") {
      findingsList.push({
        code: "missing-appeal-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.insurer} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (!packet.owner && packet.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "high",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        scope: packet.scope,
        message: "A high-severity evidence packet is still unassigned."
      });
    }

    if (hoursBetween(packet.openedAt, now) >= staleAfterHours) {
      findingsList.push({
        code: "stale-open-packet",
        severity: packet.severity === "high" ? "high" : "medium",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: `${packet.kind} evidence has been open longer than the routing SLA.`
      });
    }
  }

  return {
    ok: findingsList.every((finding) => finding.severity !== "high"),
    claims: payload.claims.length,
    onTrackClaims,
    packets: payload.packets.length,
    highSeverityPackets,
    workflowGaps,
    stalePackets: findingsList.filter((finding) => finding.code === "stale-open-packet").length,
    findingsList
  };
}

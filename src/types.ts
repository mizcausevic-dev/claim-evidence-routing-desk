// SPDX-License-Identifier: AGPL-3.0-or-later

export type ClaimStatus = "ON_TRACK" | "AT_RISK";
export type PacketStatus = "OPEN" | "RESOLVED";
export type Severity = "high" | "medium" | "low" | "info";
export type EvidenceKind = "Clinical" | "Coding" | "Authorization" | "Appeal" | "Eligibility" | string;
export type ClaimDomain = "CLINICAL" | "CODING" | "PAYER_RULE" | "APPEAL" | "ELIGIBILITY" | string;

export interface ClaimCase {
  id: string;
  insurer: string;
  memberSegment: string;
  serviceLine: string;
  owner: string;
  status: ClaimStatus;
  workflowHealthy: boolean;
  daysToDecision: number;
  packet: string;
  excerpt: string;
  nextAction: string;
}

export interface EvidencePacket {
  id: string;
  claimId: string;
  insurer: string;
  owner?: string;
  domain: ClaimDomain;
  kind: EvidenceKind;
  severity: Severity;
  status: PacketStatus;
  scope: string;
  principal?: string;
  message: string;
  openedAt: string;
  dueAt: string;
}

export interface ClaimEvidenceExport {
  claims: ClaimCase[];
  packets: EvidencePacket[];
}

export type FindingCode =
  | "no-on-track-claims"
  | "claim-evidence-gap"
  | "missing-clinical-proof"
  | "missing-coding-proof"
  | "missing-appeal-proof"
  | "workflow-gap"
  | "stale-open-packet"
  | "high-severity-unassigned";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  subject: "claim" | "packet" | "workflow";
  subjectId: string;
  subjectName?: string;
  owner?: string;
  scope?: string;
  principal?: string;
  message: string;
}

export interface AnalysisOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}

export interface CoverageReport {
  ok: boolean;
  claims: number;
  onTrackClaims: number;
  packets: number;
  highSeverityPackets: number;
  workflowGaps: number;
  stalePackets: number;
  findingsList: Finding[];
}

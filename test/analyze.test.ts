import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { ClaimEvidenceExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): ClaimEvidenceExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as ClaimEvidenceExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts claims and packets", () => {
    const report = analyze(fixture("claims.json"), { now: NOW });
    expect(report.claims).toBe(3);
    expect(report.onTrackClaims).toBe(1);
    expect(report.packets).toBe(5);
  });

  it("flags missing on-track claims as high", () => {
    const report = analyze({ claims: [], packets: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-on-track-claims")?.severity).toBe("high");
  });

  it("flags claim evidence gaps", () => {
    const report = analyze(fixture("claims.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "claim-evidence-gap")?.scope).toBe("Advanced imaging reimbursement");
  });

  it("flags clinical, coding, appeal, and workflow gaps", () => {
    const report = analyze(fixture("claims.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "missing-clinical-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-coding-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-appeal-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "workflow-gap")).toBeDefined();
  });

  it("flags stale open packets", () => {
    const report = analyze(fixture("claims.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-open-packet")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("claims-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("claims.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("claims.json"), { now: NOW }));
    expect(summary).toMatch(/claims/);
    expect(summary).toMatch(/packets/);
  });
});

import { describe, expect, test } from "vitest";

import { renderDocs, renderOverview } from "./render.js";

describe("render surfaces", () => {
  test("overview carries the new claim title", () => {
    expect(renderOverview()).toContain("Claim Evidence Routing Desk");
    expect(renderOverview()).toContain("/claim-lane");
  });

  test("docs route exposes the CLI and API shape", () => {
    const html = renderDocs();
    expect(html).toContain("claim-evidence-desk");
    expect(html).toContain("/api/evidence-routing");
  });
});

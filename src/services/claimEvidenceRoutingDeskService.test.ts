import { describe, expect, test } from "vitest";

import {
  appealPosture,
  claimLane,
  evidenceRouting,
  payload,
  summary,
  validation
} from "./claimEvidenceRoutingDeskService.js";

describe("claim evidence desk service", () => {
  test("summary reports claim and packet counts", () => {
    const result = summary();
    expect(result.claims).toBe(3);
    expect(result.onTrackClaims).toBe(1);
    expect(result.packets).toBe(5);
  });

  test("lane and appeal packets are present", () => {
    expect(claimLane()).toHaveLength(4);
    expect(appealPosture()).toHaveLength(3);
  });

  test("payload includes routing findings and verification", () => {
    expect(evidenceRouting().length).toBeGreaterThan(0);
    expect(validation()).toHaveLength(5);
    expect(payload().sample.claims[0]?.insurer).toBe("Meridian Health Plan");
  });
});

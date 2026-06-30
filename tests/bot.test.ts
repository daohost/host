import { FeatureStatus } from "../src";

describe("testing bots", () => {
  test("features", () => {
    expect(FeatureStatus.LIVE.toString()).toEqual("Live");
  });
});

import { ArtifactType } from "../src";

describe("testing artifacts", () => {
  test("types", () => {
    expect(ArtifactType.VALUE.toString()).toEqual("VALUE");
  });
});

import { defi, DefiCategory } from "../src";

describe("testing defi", () => {
  test("view org", () => {
    expect(defi["uniswap"].protocols["v2"].category).toEqual(DefiCategory.AMM);
  });
});

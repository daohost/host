import { defi } from "../src";
import { DefiCategory } from "../src/defi";

describe("testing defi", () => {
  test("view org", () => {
    expect(defi["uniswap"].protocols["uniswapV2"].category).toEqual(
      DefiCategory.AMM,
    );
  });
});

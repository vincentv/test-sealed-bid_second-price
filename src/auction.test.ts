import { describe, it, expect } from "vitest";
import { type Bid, findWinningBid } from "./auction";

describe("sealed-bid second-price auction", () => {
  const reserve = 100;
  const bids: Bid[] = [
    { bidder: "A", value: 110 },
    { bidder: "A", value: 130 },
    { bidder: "C", value: 125 },
    { bidder: "D", value: 105 },
    { bidder: "D", value: 115 },
    { bidder: "D", value: 90 },
    { bidder: "E", value: 132 },
    { bidder: "E", value: 135 },
    { bidder: "E", value: 140 },
  ];

  it("should find bidder E as the winner with the winning price of 130 euro", () => {
    const result = findWinningBid(bids, reserve);
    expect(result).toEqual({ bidder: "E", value: 130 });
  });

  it("should determine the highest bidder as the winner", () => {
    const bids: Bid[] = [
      { bidder: "A", value: 110 },
      { bidder: "C", value: 125 },
      { bidder: "D", value: 90 },
      { bidder: "E", value: 140 },
    ];

    const result = findWinningBid(bids, reserve);
    expect(result?.bidder).toEqual("E");
  });

  it("should set the winning price to the highest bid placed by any non-winning bidder that is above the reserve price", () => {
    const bids: Bid[] = [
      { bidder: "A", value: 110 },
      { bidder: "C", value: 125 },
      { bidder: "D", value: 90 },
      { bidder: "E", value: 140 },
    ];

    const result = findWinningBid(bids, reserve);
    expect(result?.value).toEqual(125);
  });

  it("should set the winning price to the reserve price if no second highest bid", () => {
    const bids: Bid[] = [
      { bidder: "D", value: 90 },
      { bidder: "E", value: 132 },
      { bidder: "E", value: 135 },
      { bidder: "E", value: 140 },
    ];

    const result = findWinningBid(bids, reserve);
    expect(result?.value).toEqual(reserve);
  });

  it("should handle multiple bids from the same bidder", () => {
    const bids: Bid[] = [
      { bidder: "A", value: 110 },
      { bidder: "A", value: 130 },
      { bidder: "C", value: 125 },
    ];

    const result = findWinningBid(bids, reserve);
    expect(result).toEqual({ bidder: "A", value: 125 });
  });

  it("should handle no bids", () => {
    const result = findWinningBid([], 100);
    expect(result).toBeUndefined();
  });
});

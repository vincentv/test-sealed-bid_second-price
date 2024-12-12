export interface Bid {
  value: number;
  bidder: string;
}

export type WinningBid = Bid;

function aggregateHighestBids(bidderHighestBids: Record<string, number>, nextBid: Bid): Record<string, number> {
  const currentBidderValue = bidderHighestBids[nextBid.bidder];

  return currentBidderValue !== undefined && currentBidderValue > nextBid.value
    ? bidderHighestBids
    : { ...bidderHighestBids, [nextBid.bidder]: nextBid.value };
}

/**
 * Finds the winning bid in a sealed-bid second-price auction.
 *
 * @param {readonly Bid[]} bids - List of bids, where each bid contains a bidder and an price.
 * @param {number} reserve - The reserve price for the auction.
 * @returns {WinningBid | undefined} - The winning bid with the bidder and the winning price, or undefined if there is no valid bid.
 */
export function findWinningBid(bids: readonly Bid[], reserve: number): WinningBid | undefined {
  const bidderHighestBids = bids.filter(({ value }) => value >= reserve).reduce(aggregateHighestBids, {});

  const result = Object.entries(bidderHighestBids).sort(([, aValue], [, bValue]) => bValue - aValue);
  const winner = result[0]?.[0];
  const price = result[1]?.[1] ?? reserve;

  return !winner ? undefined : { bidder: winner, value: price };
}

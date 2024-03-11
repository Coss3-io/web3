import { usePriceStore } from ".";

/**
 * 
 * @param this - the price store
 * @param prices - An array containing the crypto prices to be loaded
 */
export function loadPrices(
  this: ReturnType<typeof usePriceStore>,
  prices: Array<{ symbol: string; current_price: number }>
): void {
  prices.forEach(({ symbol, current_price }) => {
    this.$state[symbol.toUpperCase()] = current_price;
  });
}

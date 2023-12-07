import { usePriceStore } from ".";

export function loadPrices(
  this: ReturnType<typeof usePriceStore>,
  prices: Array<{ symbol: string; current_price: number }>
): void {
  prices.forEach(({ symbol, current_price }) => {
    this.$state[symbol.toUpperCase()] = current_price;
  });
}

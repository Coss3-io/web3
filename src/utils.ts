import { usePriceStore } from "./store/price";

/**
 * @notice - used to display the beginning and the end of an address only
 * @param address - the address to display
 * @returns - The formatted address to be displayed
 */
export function displayAddress(address: string): string {
  const length = address.length - 1;
  return `${address.slice(0, 6)}...${address.slice(length - 4)}`;
}

/**
 * @notice - used to format a number to a nice looking format
 * @param number - The number to convert to stylized string
 * @returns - the stylized string
 */
export function displayNumber(number: number): string {
  if(number || number === 0){
    return String(number)
      .split("")
      .reverse()
      .join("")
      .match(/.{1,3}/g)!
      .join(",")
      .split("")
      .reverse()
      .join("");
  } else {
    return ""
  }
}

/**
 * @notice - function used to determine the dollars value of a given input
 * @param obj - the tokens amount object 
 * @returns - the dollars value of the inputs
 */
export function dollarsValue(tokens: {[key in string]: number}): number {
  const priceStore = usePriceStore()
  let $value = 0
  Object.entries(tokens).forEach(([token, amount]) => {
    if(token in priceStore.$state) {
      $value += priceStore.$state[token]
    }
  })
  return $value
}

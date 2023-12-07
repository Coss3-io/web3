export type PriceState = {
    [key in string]: number
}

export const PriceActions = {
    LoadPrices: "LoadPrices"
} as const
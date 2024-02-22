export type BotState = {
    bots: Array<{
        baseUSD: number;
        quoteUSD: number;
        basePrice: number;
        quotePrice: number;
        address: string;
        baseToken: string;
        baseTokenAmount: number;
        chainId: number;
        feesEarned: number;
        lowerBound: number;
        makerFees: number;
        price: number;
        amount: number;
        quoteToken: string;
        quoteTokenAmount: number;
        step: number;
        timestamp: number;
        expiry: number;
        upperBound: number;
      }>;
    loaded: boolean
}

export type BotAPI = {
    address: string;
    chain_id: number;
    fees_earned: string;
    lower_bound: string;
    maker_fees: string;
    price: string;
    step: string;
    timestamp: number;
    upper_bound: string;
}

export type BotFormatted = {
    address: string;
    chainId: number;
    feesEarned: number;
    lowerBound: number;
    makerFees: number;
    price: number;
    step: number;
    timestamp: number;
    upperBound: number;
}

export const BotActions = {
    Reset: "Reset",
    AddBot: "AddBot",
    UpdateLoaded: "UpdateLoaded"
} as const

export const BotGetters = {
    TotalVolume: "TotalVolume",
    TotalFees: "TotalFees",
    TotalYield: "TotalYield",
    TotalValue: "TotalValue",
}
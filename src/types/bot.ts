export type BotState = {
    bots: Array<{
        botHash: string;
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
    amount: string;
    base_token: string;
    base_token_amount: string;
    quote_token: string;
    quote_token_amount: string;
    signature: string;
    chain_id: number;
    fees_earned: string;
    lower_bound: string;
    maker_fees: string;
    price: string;
    step: string;
    timestamp: number;
    expiry: number;
    upper_bound: string;
    bot_hash: string;
}

export type BotFormatted = {
    address: string;
    amount: number;
    baseTokenAmount?: number;
    quoteTokenAmount?: number;
    signature?: string;
    chainId: number;
    feesEarned: number;
    lowerBound: number;
    makerFees: number;
    price: number;
    step: number;
    timestamp: number;
    upperBound: number;
    botHash: string;
}

export const BotActions = {
    Reset: "Reset",
    AddBot: "AddBot",
    UpdateLoaded: "UpdateLoaded",
    DeleteBot: "DeleteBot"
} as const

export const BotGetters = {
    TotalVolume: "TotalVolume",
    TotalFees: "TotalFees",
    TotalYield: "TotalYield",
    TotalValue: "TotalValue",
    TotalInOrdersRaw: "TotalInOrdersRaw",
} as const
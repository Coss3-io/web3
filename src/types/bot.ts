export type BotState = {
    bots: Array<{
        address: string;
        baseToken: string;
        baseTokenAmount: number;
        chainId: number;
        feesEarned: number;
        lowerBound: number;
        makerFees: number;
        price: number;
        quoteToken: string;
        quoteTokenAmount: number;
        step: number;
        timestamp: number;
        expiry: number;
        upperBound: number;
      }>;
    loaded: boolean
}

export const BotActions = {
    Reset: "Reset",
    AddBot: "AddBot",
    UpdateLoaded: "UpdateLoaded"
} as const
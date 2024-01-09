export type BotState = {
    bots: Array<{
        address: string;
        base_token: string;
        base_token_amount: number;
        chain_id: number;
        fees_earned: number;
        lower_bound: number;
        maker_fees: number;
        price: number;
        quote_token: string;
        quote_token_amount: number;
        step: number;
        timestamp: number;
        expiry: number;
        upper_bound: number;
      }>;
    loaded: boolean
}

export const BotActions = {
    Reset: "Reset",
    AddBot: "AddBot",
    UpdateLoaded: "UpdateLoaded"
} as const
import {
  buyLogo,
  sellLogo,
  allLogo,
  limitOrderLogo,
  marketOrderLogo,
  openOrderLogo,
  filledOrderLogo,
  cancelledOrderLogo,
} from "../asset/images/images";

export const orderType = {
  Maker: "Maker",
  All: "All",
  Taker: "Taker",
} as const;

export const orderSide = {
  Buy: "Buy",
  All: "All",
  Sell: "Sell",
} as const;

export const orderStatus = {
  Open: "Open",
  All: "All",
  Filled: "Filled",
  Cancelled: "Cancel",
} as const;

export const orderSideBg = {
  Buy: "!bg-green-700",
  All: "",
  Sell: "!bg-red-700",
} as const;

export const orderTypeBg = {
  Maker: "!bg-neutral",
  All: "",
  Taker: "!bg-yellow-700",
} as const;

export const orderStatusBg = {
  Open: "!bg-blue-700",
  All: "",
  Filled: "!bg-green-700",
  Cancelled: "!bg-red-700",
} as const;

export const orderSideLogo = {
  Buy: buyLogo,
  All: allLogo,
  Sell: sellLogo,
} as const;

export const orderTypeLogo = {
  Maker: limitOrderLogo,
  All: allLogo,
  Taker: marketOrderLogo,
} as const;

export const orderStatusLogo = {
  Open: openOrderLogo,
  All: allLogo,
  Filled: filledOrderLogo,
  Cancelled: cancelledOrderLogo,
} as const;

//@ts-ignore
import { signMessage } from "@wagmi/core";
import { useNotification } from "@kyvg/vue3-notification";
import { useAccountStore } from "../store/account";
import axios, { AxiosResponse } from "axios";
import { AccountActions } from "../types/account";
import { useStackingStore } from "../store/stacking";
import { StackingActions } from "../types/stacking";
import { usePriceStore } from "../store/price";
import { PriceActions } from "../types/price";
import { getSigner } from "../utils";
import { useBotStore } from "../store/bot";
import { BotActions, BotState } from "../types/bot";
import BigNumber from "bignumber.js";
import { useOrderStore } from "../store/order";
import { OrderActions } from "../types/order";

const { notify } = useNotification();
export class Client {
  private static url = "http://localhost:8000";

  private static coinGeckoAPIUrl = "https://api.coingecko.com/";
  private static coinGeckoAPIPath = "/api/v3/coins/markets";

  private static loginPath = "/api/login";
  private static takerPath = "/api/taker";
  private static stakingPath = "/api/stacking";
  private static feesWithdrawalPath = "/api/fees-withdrawal";
  private static globalStakingPath = "/api/global-stacking";
  private static stakingFeesPath = "/api/stacking-fees";
  private static botDataPath = "/api/bot";
  private static makerDataPath = "/api/orders";
  private static takerDataPath = "/api/taker";

  public static accountStore: ReturnType<typeof useAccountStore>;
  public static stackingStore: ReturnType<typeof useStackingStore>;
  public static priceStore: ReturnType<typeof usePriceStore>;
  public static botStore: ReturnType<typeof useBotStore>;
  public static orderStore: ReturnType<typeof useOrderStore>;

  constructor() {}

  /**
   * @dev function used to check if the user is connected to the API
   */
  public static async checkConnection(): Promise<void> {
    Client.accountStore[AccountActions.UpdateLoaded](false);
    try {
      let response = await axios.get(this.url + this.takerPath, {
        params: {
          chain_id: this.accountStore.$state.networkId,
          base_token: "0x0000000000000000000000000000000000000000",
          quote_token: "0x0000000000000000000000000000000000000000",
        },
        withCredentials: true,
      });
      if (response.status == axios.HttpStatusCode.Ok) {
        Client.accountStore[AccountActions.UpdateAppConnection](true);
      }
    } catch (e) {
      console.log(
        "The user was not connected this should not be considered as an error "
      );
      console.log(e);
    }
    Client.accountStore[AccountActions.UpdateLoaded](true);
  }

  /**
   * @notice decorator to set the user on a loading state
   * @param target
   * @param propertyKey
   * @param descriptor
   * @returns
   */
  public static loginLoad(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      Client.accountStore[AccountActions.UpdateLoaded](false);
      const result = await originalMethod.apply(this, args);
      Client.accountStore[AccountActions.UpdateLoaded](true);
      return result;
    };

    return descriptor;
  }

  /**
   * @dev mark the user as logged out
   */
  public static async logout(): Promise<void> {
    Client.accountStore[AccountActions.UpdateAppConnection](false);
  }

  /**
   * @dev attemps to log the user in
   * @returns success of failure of the log in
   */
  @Client.loginLoad
  public static async login(): Promise<boolean> {
    let success = false;
    if (!Client.accountStore.$state.address) {
      notify({
        text: "You need to connect to your wallet first",
        type: "info",
      });
      return success;
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await signMessage({
      message: `log in into coss3.io as ${Client.accountStore.$state.address} at ${timestamp}`,
    });

    try {
      let response = await axios.post(
        this.url + this.loginPath,
        {
          timestamp: timestamp,
          address: Client.accountStore.$state.address,
          signature: signature,
        },
        { withCredentials: true, withXSRFToken: true }
      );

      if (response.status == axios.HttpStatusCode.Ok) {
        notify({ text: "Successfull log in", type: "success" });
        success = true;
      } else {
        notify({ text: "Log in failed (check console)", type: "warn" });
        console.log(response);
      }
    } catch (e) {
      notify({
        text: "An error occured during log in (check console)",
        type: "warn",
      });
      console.log(e);
    }
    Client.accountStore[AccountActions.UpdateAppConnection](success);
    return success;
  }

  /**
   * @notice - Used to load the public stacking data
   * @returns - Promise<boolean>
   */
  public static async loadPublicStacking(): Promise<boolean> {
    if (this.stackingStore.$state.public.loaded) return true;

    let success = false;
    let stacking, fees, coinGeckoPrices: AxiosResponse;
    try {
      [stacking, fees, coinGeckoPrices] = await Promise.all([
        axios.get(this.url + this.globalStakingPath, {
          params: { chain_id: this.accountStore.$state.networkId },
        }),
        axios.get(this.url + this.stakingFeesPath, {
          params: { chain_id: this.accountStore.$state.networkId },
        }),
        axios.get(this.coinGeckoAPIUrl + this.coinGeckoAPIPath, {
          params: { vs_currency: "usd" },
        }),
      ]);
      Client.stackingStore[StackingActions.LoadStacks](stacking.data);
      Client.stackingStore[StackingActions.LoadFees](fees.data);
      Client.priceStore[PriceActions.LoadPrices](coinGeckoPrices.data);
      success = true;
      this.stackingStore.$state.public.loaded = true;
    } catch (e) {
      notify({
        text: "An error occured during public data request check console",
        type: "warn",
      });
      console.log(e);
    }
    return success;
  }
  public static async loadUserStacking(): Promise<boolean> {
    if (this.stackingStore.$state.user.loaded) return true;
    if (!this.accountStore.$state.appConnected) return false;

    let success = false;
    let stacking, feesWithdrawal: AxiosResponse;

    try {
      [stacking, feesWithdrawal] = await Promise.all([
        axios.get(this.url + this.stakingPath, {
          withCredentials: true,
          params: { chain_id: this.accountStore.$state.networkId },
        }),
        axios.get(this.url + this.feesWithdrawalPath, {
          withCredentials: true,
          params: { chain_id: this.accountStore.$state.networkId },
        }),
      ]);
      Client.stackingStore[StackingActions.LoadUserStacks](stacking.data);
      Client.stackingStore[StackingActions.LoadUserFeesWithdrawal](
        feesWithdrawal.data
      );

      success = true;
      this.stackingStore.$state.user.loaded = true;
    } catch (e) {
      notify({
        text: "An error occured during user data request check console",
        type: "warn",
      });
      console.log(e);
    }
    return success;
  }

  /**
   * @notice - Function used to retrieve the user bots
   * @returns - The succes or the failiure of the bot retrieval
   */
  public static async loadUserBots(): Promise<boolean> {
    if (this.botStore.loaded) return true;
    if (!this.accountStore.$state.appConnected) return false;

    let success = false;
    let botsList: AxiosResponse;

    try {
      botsList = await axios.get(this.url + this.botDataPath, {
        withCredentials: true,
        params: {
          chain_id: this.accountStore.$state.networkId,
        },
      });
      success = true;
      const promises = botsList.data.map((bot: BotState["bots"][0]) =>
        this.botStore[BotActions.AddBot](bot)
      );
      await Promise.all(promises);
      this.botStore.loaded = true;
    } catch (e) {
      notify({
        text: "An error occured during user bot data request check console",
        type: "warn",
      });
      console.log(e);
    }
    return success;
  }

  public static async createUserBot(
    data: { [key in string]: any },
    baseNeeded: string,
    quoteNeeded: string,
    encodedData: string
  ): Promise<boolean> {
    let success = false;
    let response: AxiosResponse;
    const signer = await getSigner(
      this.accountStore.$state.networkId!,
      this.accountStore.$state.networkName!
    );

    try {
      if (!signer) throw new Error("The signer couldn't be loaded properly");
      const signature = await signer.provider.send("personal_sign", [
        encodedData,
        signer.address.toLowerCase(),
      ]);

      data["signature"] = signature;
      response = await axios.post(this.url + this.botDataPath, data);
      success = true;
    } catch (e) {
      notify({
        text: "An error occured during bot creation check console",
        type: "warn",
      });
      console.log(e);
    }
    this.botStore[BotActions.AddBot]({
      address: data.address,
      amount: data.amount,
      baseToken: data.base_token,
      chainId: data.chain_id,
      feesEarned: 0,
      baseTokenAmount: new BigNumber(baseNeeded)
        .multipliedBy("1e18")
        .toNumber(),
      lowerBound: data.lower_bound,
      makerFees: data.maker_fees,
      price: data.price,
      quoteToken: data.quote_token,
      quoteTokenAmount: new BigNumber(quoteNeeded)
        .multipliedBy("1e18")
        .toNumber(),
      step: data.step,
      timestamp: Math.floor(Date.now() / 1000),
      expiry: Number(data.expiry),
      upperBound: data.upper_bound,
    });
    return success;
  }

  public static async loadPair(base: string, quote: string): Promise<boolean> {
    try {
      const makersPromise = axios.get(this.url + this.makerDataPath, {
        params: {
          chain_id: this.accountStore.$state.networkId,
          base_token: base,
          quote_token: quote,
        },
      });
      const takersPromise = axios.get(this.url + this.takerDataPath, {
        params: {
          chain_id: this.accountStore.$state.networkId,
          base_token: base,
          quote_token: quote,
        },
      });
      const [makers, takers] = await Promise.all([
        makersPromise,
        takersPromise,
      ]);
      if (
        makers.status != axios.HttpStatusCode.Ok ||
        takers.status != axios.HttpStatusCode.Ok
      ) {
        notify({
          text: "An error occured during orders loading please refresh the page",
          type: "warn",
        });
        return false;
      }
      this.orderStore[OrderActions.LoadOrders](
        makers.data,
        takers.data,
        base,
        quote
      );
      this.orderStore.$state.makersLoaded[`${base}${quote}`] = true;
      this.orderStore.$state.takersLoaded[`${base}${quote}`] = true;
      console.log(this.orderStore.$state)
    } catch (e) {
      notify({
        text: "An error occured during orders loading check console",
        type: "warn",
      });
      console.log("The orders failed to be loaded check console");
      console.log(e);
      return false;
    }

    return true;
  }
}

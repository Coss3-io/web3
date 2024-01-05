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
  public static accountStore: ReturnType<typeof useAccountStore>;
  public static stackingStore: ReturnType<typeof useStackingStore>;
  public static priceStore: ReturnType<typeof usePriceStore>;

  public static publicStackingLoaded: boolean = false;
  public static userStackingLoaded: boolean = false;
  public static userBotsLoaded: boolean = false;

  constructor() {}

  /**
   * @dev function used to check if the user is connected to the API
   */
  public static async checkConnection(): Promise<void> {
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
      Client.accountStore[AccountActions.UpdateLoading](true);
      const result = await originalMethod.apply(this, args);
      Client.accountStore[AccountActions.UpdateLoading](false);
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
    if (this.publicStackingLoaded) return true;

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
      this.publicStackingLoaded = true;
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
    if (this.userStackingLoaded) return true;

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
      this.userStackingLoaded = true;
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
    if (this.userBotsLoaded) return true;

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
      this.userBotsLoaded = true;
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
    encodedData: string
  ): Promise<boolean> {
    let success = false;
    let botsList: AxiosResponse;
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
      botsList = await axios.post(this.url + this.botDataPath, data);
      success = true;
    } catch (e) {
      notify({
        text: "An error occured during bot creation check console",
        type: "warn",
      });
      console.log(e);
    }
    return success;
  }
}

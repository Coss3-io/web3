//@ts-ignore
import { erc20ABI, signMessage } from "@wagmi/core";
import { useNotification } from "@kyvg/vue3-notification";
import { useAccountStore } from "../store/account";
import axios, { AxiosResponse } from "axios";
import { AccountActions } from "../types/account";
import { useStackingStore } from "../store/stacking";
import { StackingActions } from "../types/stacking";
import { usePriceStore } from "../store/price";
import { PriceActions } from "../types/price";
import { computeBotOrders, getSigner, tokenToName } from "../utils";
import { useBotStore } from "../store/bot";
import { BotActions, BotAPI } from "../types/bot";
import { useOrderStore } from "../store/order";
import { Maker, OrderActions, Taker } from "../types/order";
import { message } from "../types/websocket";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { dexContract } from "../types/contractSpecs";

const { notify } = useNotification();
export class Client {
  private static url = "http://localhost:8000";
  private static wsUrl = "ws://localhost:8000";

  private static coinGeckoAPIUrl = "https://api.coingecko.com/";
  private static coinGeckoAPIPath = "/api/v3/coins/markets";

  private static loginPath = "/api/login";
  private static stakingPath = "/api/stacking";
  private static feesWithdrawalPath = "/api/fees-withdrawal";
  private static globalStakingPath = "/api/global-stacking";
  private static stakingFeesPath = "/api/stacking-fees";
  private static botDataPath = "/api/bot";
  private static makerDataPath = "/api/order";
  private static ordersDataPath = "/api/batch-orders";

  public static accountStore: ReturnType<typeof useAccountStore>;
  public static stackingStore: ReturnType<typeof useStackingStore>;
  public static priceStore: ReturnType<typeof usePriceStore>;
  public static botStore: ReturnType<typeof useBotStore>;
  public static orderStore: ReturnType<typeof useOrderStore>;

  public static provider: ethers.JsonRpcProvider;
  public static signer: ethers.JsonRpcSigner;
  public static dexContract: ethers.Contract;
  public static cossContract: ethers.Contract;
  public static stackingContract: ethers.Contract;

  public static watchTowerURL = "http://localhost:3000";
  private static pairWsPath = "/ws/trade/";
  private static stackingWsPath = "/ws/stacking/";
  private static ws: { [key in string]: WebSocket } = {};

  private static loadingBots: boolean = false;
  private static loggedOut: boolean = false;

  constructor() {}

  /**
   * @dev function used to check if the user is connected to the API
   */
  public static async checkConnection(): Promise<void> {
    if (!this.accountStore.$state.networkId || this.loggedOut) return;
    Client.accountStore[AccountActions.UpdateLoaded](false);
    try {
      let response = await axios.get(this.url + this.botDataPath, {
        params: {
          chain_id: this.accountStore.$state.networkId,
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
    this.loggedOut = true;
    this.reset();
  }

  /**
   * @notice - Used to restore the state of the store and all ws
   * for example on network change
   */
  public static reset(): void {
    //this.accountStore[AccountActions.Reset]();
    this.botStore[BotActions.Reset]();
    this.stackingStore[StackingActions.Reset]();
    this.orderStore[OrderActions.Reset]();
    Object.values(this.ws).forEach((ws) => {
      ws.close();
    });
    this.ws = {};
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
        this.loggedOut = false;
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
      this.connectWsStacking();
    } catch (e) {
      notify({
        text: "An error occured during public data request check console",
        type: "warn",
      });
      console.log(e);
    }
    return success;
  }

  /**
   * @notice - Used to load the user stacking data
   * @returns - Boolean success or failiure of the stacking loading
   */
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
    if (this.botStore.loaded || this.loadingBots) return true;
    if (!this.accountStore.$state.appConnected) return false;
    let success = false;
    this.loadingBots = true;
    let botsList: AxiosResponse;

    try {
      botsList = await axios.get(this.url + this.botDataPath, {
        withCredentials: true,
        params: {
          chain_id: this.accountStore.$state.networkId,
        },
      });

      if (botsList.status != axios.HttpStatusCode.Ok) {
        notify({
          text: "An error occured during user bot data request check console",
          type: "warn",
        });
        console.log(botsList.data);
      } else {
        success = true;
        const promises = botsList.data.map(
          async (bot: BotAPI) => await this.botStore[BotActions.AddBot](bot)
        );
        await Promise.all(promises);
      }
    } catch (e) {
      notify({
        text: "An error occured during user bot data request check console",
        type: "warn",
      });
      this.loadingBots = false;
      console.log(e);
    }
    this.loadingBots = false;
    this.botStore.loaded = true;
    return success;
  }

  /**
   * @notice - Function used to create a bot by signing data
   * @param data - The bot details about to be created
   * @param baseNeeded - The base token amount needed to create the bot
   * @param quoteNeeded - The quote token amount needed to create the bot
   * @param encodedData - Then encoded data for the signature
   * @returns
   */
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
      return success;
    }
    const pair = `${data.base_token}${data.quote_token}`;
    if (!this.ws[pair]) {
      this.botStore[BotActions.AddBot]({
        botHash: ethers.keccak256(encodedData),
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
    }
    return success;
  }

  /**
   * @notice Used to sign a send a new order to the backend
   * @param data - The order data
   * @param encodedData - The encoded data to be signed
   * @returns Booloan - success or failiure of the function
   */
  public static async createUserOrder(
    data: { [key in string]: any },
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
      response = await axios.post(this.url + this.makerDataPath, data);
      success = true;
    } catch (e) {
      notify({
        text: "An error occured during order creation check console",
        type: "warn",
      });
      console.log(e);
    }
    return success;
  }

  /**
   * @notice - Used to connect to the websocket of the specified pair
   * @param base - The base token of the pair to connect to
   * @param quote - The quote token of the pair to connect to
   */
  private static async connectWsPair(
    base: string,
    quote: string
  ): Promise<void> {
    const ws = new WebSocket(
      `${this.wsUrl}${this.pairWsPath}${this.accountStore
        .networkId!}/${base}/${quote}`
    );
    const pair = `${base}${quote}`;

    ws.addEventListener("open", () => {
      this.ws[pair] = ws;
      console.log(
        `Connected to the ${tokenToName(
          base,
          this.accountStore.networkId!
        )}/${tokenToName(quote, this.accountStore.networkId!)} pair Ws`
      );
    });

    ws.addEventListener("message", async (msg) => {
      const data = JSON.parse(msg["data"]);
      if (data[message.NEW_MAKER])
        this.orderStore[OrderActions.AddOrder](
          data[message.NEW_MAKER],
          this.accountStore.$state.address!
        );
      if (data[message.NEW_BOT]) {
        const bot = data[message.NEW_BOT];
        await this.botStore[BotActions.AddBot]({
          address: bot.address,
          amount: bot.amount,
          baseToken: bot.base_token,
          chainId: bot.chain_id,
          feesEarned: 0,
          baseTokenAmount: bot.base_token_amount,
          lowerBound: bot.lower_bound,
          makerFees: bot.maker_fees,
          price: bot.price,
          quoteToken: bot.quote_token,
          quoteTokenAmount: bot.quote_token_amount,
          step: bot.step,
          timestamp: Math.floor(Date.now() / 1000),
          expiry: Number(bot.expiry),
          upperBound: bot.upper_bound,
        });

        const makers: Array<Maker> = computeBotOrders(bot);
        makers.forEach((maker) => {
          this.orderStore[OrderActions.AddOrder](
            maker,
            this.accountStore.$state.address!
          );
        });
      }
      if (data[message.DEL_MAKERS]) {
        const deleteHashes = data[message.DEL_MAKERS];
        this.orderStore[OrderActions.DeleteOrder](
          deleteHashes,
          pair,
          this.accountStore.$state.address!
        );
      }
      if (data[message.DEL_BOTS]) {
        const deleteBotHashes = data[message.DEL_BOTS];
        this.botStore[BotActions.DeleteBot](deleteBotHashes);
      }
      if (data[message.NEW_TAKERS]) {
        data[message.NEW_TAKERS].forEach(
          (taker: Taker & { address: string }) => {
            this.orderStore[OrderActions.AddTaker](
              taker,
              pair,
              this.accountStore.$state.address!
            );
          }
        );
      }
      if (data[message.MAKERS_UPDATE]) {
        data[message.MAKERS_UPDATE].forEach((maker: Maker) => {
          this.orderStore[OrderActions.UpdateMaker](
            maker,
            pair,
            this.accountStore.$state.address!
          );
        });
      }
    });

    ws.addEventListener("error", (e) => {
      console.log(
        `An error occured on the ${tokenToName(
          base,
          this.accountStore.networkId!
        )}/${tokenToName(quote, this.accountStore.networkId!)} pair Ws`
      );
      delete this.ws[pair];
      console.log(e);
    });
  }

  /**
   * @notice - Used to connect to the staking websocket in order to
   * receive the onchain stacking updates
   */
  public static async connectWsStacking(): Promise<void> {
    const ws = new WebSocket(
      `${this.wsUrl}${this.stackingWsPath}${this.accountStore.networkId!}`
    );

    ws.addEventListener("open", () => {
      this.ws["stacking"] = ws;
      console.log(`Connected to the stacking WS`);
    });

    ws.addEventListener("message", async (msg) => {
      const data = JSON.parse(msg["data"]);
      if (data[message.NEW_STACKING]) {
        this.stackingStore[StackingActions.AddStack](
          data[message.NEW_STACKING],
          this.accountStore.address!
        );
      }
      if (data[message.NEW_FEES]) {
        this.stackingStore[StackingActions.AddFees](data[message.NEW_FEES]);
      }
      if (data[message.NEW_FSA_WITHDRAWAL]) {
        this.stackingStore[StackingActions.AddFeesWithdrawal](
          data[message.NEW_FSA_WITHDRAWAL],
          this.accountStore.address!
        );
      }
    });

    ws.addEventListener("error", (e) => {
      console.log(`An error occured on the staking WS`);
      delete this.ws["stacking"];
      console.log(e);
    });
  }

  /**
   * @notice - Used to loading orders for a given pair, to
   * populate the orderbooks and the user orders
   *
   * @param base - The base token of the pair to load
   * @param quote - The quote token of the pair to load
   * @returns - The success or failliure of the request
   */
  public static async loadPair(base: string, quote: string): Promise<boolean> {
    const pair = `${base}${quote}`;
    try {
      if (
        this.orderStore.$state.makersLoaded[pair] &&
        this.orderStore.$state.takersLoaded[pair]
      )
        return true;
      const orders = await axios.get(this.url + this.ordersDataPath, {
        params: {
          chain_id: this.accountStore.$state.networkId,
          base_token: base,
          quote_token: quote,
        },
        withCredentials: true,
      });

      if (orders.status != axios.HttpStatusCode.Ok) {
        notify({
          text: "An error occured during orders loading please refresh the page",
          type: "warn",
        });
        return false;
      }
      this.connectWsPair(base, quote);
      this.orderStore[OrderActions.LoadOrders](
        orders.data["makers"],
        orders.data["takers"],
        orders.data["user_makers"],
        orders.data["user_takers"],
        base,
        quote
      );
      this.orderStore.$state.makersLoaded[pair] = true;
      this.orderStore.$state.takersLoaded[pair] = true;
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

  /**
   * @notice - Used to load the user orders
   * @returns - Boolean success or failiure of the loading of the orders
   */
  public static async loadUserOrders(): Promise<boolean> {
    if (!this.accountStore.$state.networkId) return false;
    if (this.orderStore.$state.userOrdersLoaded) return true;
    this.orderStore.$state.userOrdersLoaded = true;

    try {
      const makers = await axios.get(this.url + this.makerDataPath, {
        params: {
          chain_id: this.accountStore.$state.networkId,
          all: true,
        },
        withCredentials: true,
      });

      if (makers.status != axios.HttpStatusCode.Ok) {
        notify({
          text: "An error occured during user orders loading",
          type: "warn",
        });
        this.orderStore.$state.userOrdersLoaded = false;
        return false;
      }

      let orderGroup: { [key in string]: typeof makers.data } = {};
      makers.data.forEach((maker: typeof makers.data) => {
        const pair = maker.base_token + maker.quote_token;
        if (!orderGroup[pair]) orderGroup[pair] = [];
        orderGroup[pair].push(maker);
      });
      Object.entries(orderGroup).forEach((entry) => {
        this.orderStore[OrderActions.LoadOrders](
          [],
          [],
          entry[1],
          [],
          entry[1][0].base_token,
          entry[1][0].quote_token
        );
      });
    } catch (e) {
      notify({
        text: "An error occured during user orders loading check console",
        type: "warn",
      });
      console.log("The orders failed to be loaded check console");
      console.log(e);
      this.orderStore.$state.userOrdersLoaded = false;
      return false;
    }
    return true;
  }

  /**
   * @notice - Function used to get the balances for one or a pair of tokens
   */
  public static async getBalances(
    token: [string, string]
  ): Promise<[BigNumber, BigNumber]>;
  public static async getBalances(token: string): Promise<BigNumber>;
  public static async getBalances(
    token: string | [string, string]
  ): Promise<BigNumber | [BigNumber, BigNumber] | void> {
    if (!this.provider) return;

    try {
      if (typeof token === "string") {
        const contract = new ethers.Contract(token, erc20ABI, this.provider);
        return new BigNumber(
          await contract.balanceOf(this.accountStore.address)
        ).dividedBy("1e18");
      } else {
        const base = new ethers.Contract(token[0], erc20ABI, this.provider);
        const quote = new ethers.Contract(token[1], erc20ABI, this.provider);
        const [baseBalance, quoteBalance] = await Promise.all([
          base.balanceOf(this.accountStore.address),
          quote.balanceOf(this.accountStore.address),
        ]);
        return [
          new BigNumber(baseBalance).dividedBy("1e18"),
          new BigNumber(quoteBalance).dividedBy("1e18"),
        ];
      }
    } catch (e: any) {
      console.log("An error occured during the balance retrieval");
      notify({
        type: "warn",
        text: "An error occured during the balance retrieval check console",
      });
    }
  }

  /**
   * @notice - Function used to get the allowance for a given contract for a token or a
   * pair of tokens
   * @param token - The token to get the allowance
   * @param spender - The spender to check for the allowance
   */
  public static async getAllowance(
    token: [string, string],
    spender: string
  ): Promise<[BigNumber, BigNumber] | void>;
  public static async getAllowance(
    token: string,
    spender: string
  ): Promise<BigNumber | void>;
  public static async getAllowance(
    token: string | [string, string],
    spender: string
  ): Promise<BigNumber | [BigNumber, BigNumber] | void> {
    if (!this.provider) return;
    try {
      if (typeof token === "string") {
        const contract = new ethers.Contract(token, erc20ABI, this.provider);
        return new BigNumber(
          await contract.allowance(
            this.accountStore.address,
            dexContract[
              <keyof typeof dexContract>String(this.accountStore.networkId)
            ]
          )
        ).dividedBy("1e18");
      } else {
        const base = new ethers.Contract(token[0], erc20ABI, this.provider);
        const quote = new ethers.Contract(token[1], erc20ABI, this.provider);
        const [baseBalance, quoteBalance] = await Promise.all([
          base.allowance(this.accountStore.address, spender),
          quote.allowance(this.accountStore.address, spender),
        ]);
        return [
          new BigNumber(baseBalance).dividedBy("1e18"),
          new BigNumber(quoteBalance).dividedBy("1e18"),
        ];
      }
    } catch (e: any) {
      console.log(e);
      notify({
        type: "warn",
        text: "An error occured during allowance retrieval check console",
      });
    }
  }
}

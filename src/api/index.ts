//@ts-ignore
import { signMessage } from "@wagmi/core";
import { useNotification } from "@kyvg/vue3-notification";
import { useAccountStore } from "../store/account";
import axios from "axios";
import { AccountActions } from "../types/account";

const { notify } = useNotification();
export class Client {
  private static url = "http://localhost:8000";
  private static loginPath = "/api/login";
  private static takerPath = "/api/taker";
  public static accountStore: ReturnType<typeof useAccountStore>;

  constructor() {}

  /**
   * @dev function used to check if the user is connected to the API
   */
  public static async checkConnection(): Promise<void> {
    try {
      let response = await axios.get(this.url + this.takerPath, {
        params: {
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
    Client.accountStore[AccountActions.UpdateAppConnection](success)
    return success;
  }
}

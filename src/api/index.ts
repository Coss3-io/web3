//@ts-ignore
import { signMessage } from "@wagmi/core";
import { useNotification } from "@kyvg/vue3-notification";
import axios, { AxiosError } from "axios";

const { notify } = useNotification();

export class Client {
  private static cookies?: string;
  private static url = "http://localhost:8000";
  private static loginPath = "/api/login";

  constructor() {}

  public static async login(address: string | undefined): Promise<boolean> {
    let success = false;
    if (!address) {
      notify({ text: "You need to connect to your wallet first", type: "info" });
      return success;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await signMessage({
      message: `log in into coss3.io as ${address} at ${timestamp}`,
    });

    try {
      let response = await axios.post(
        this.url + this.loginPath,
        {
          timestamp: timestamp,
          address: address,
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
    return success;
  }
}

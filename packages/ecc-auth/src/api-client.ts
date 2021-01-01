import { Keys } from "./types";
import type { getRequestSignature, toHex } from "./browser";

export type ApiClientOptions = {
  getRequestSignature: typeof getRequestSignature;
  toHex: typeof toHex;
};

export class ApiClient {
  constructor(
    public host: string,
    private keys: Keys,
    public options: ApiClientOptions
  ) {}

  async api(
    path: string,
    options: {
      body?: string | Record<any, any> | Uint8Array;
      headers?: Record<string, string>;
      method?: string;
    } = {}
  ) {
    if (!options.headers) {
      options.headers = {};
    }

    if (options.body) {
      if (options.body instanceof Uint8Array) {
        (options.headers as any)["content-type"] = "application/octet-stream";
      } else if (typeof options.body !== "string") {
        (options.headers as any)["content-type"] = "application/json";
        options.body = JSON.stringify(options.body);
      }
    }

    const PATH = (path.startsWith("/") ? "" : "/") + path;

    const timestamp = Date.now().toString();
    const signature = await this.options.getRequestSignature(
      options.method || "GET",
      PATH,
      timestamp,
      options.body,
      this.keys.privateKey
    );

    options.headers["x-timestamp"] = timestamp;
    options.headers["x-identity"] = this.options.toHex(this.keys.publicKey);
    options.headers["x-signature"] = this.options.toHex(signature.signature);

    // test:
    // console.log(
    //   "signature validation",
    //   await validateRequestSignature(
    //     options.headers["x-signature"],
    //     options.method || "GET",
    //     PATH,
    //     timestamp,
    //     options.body,
    //     options.headers["x-identity"]
    //   )
    // );

    options = {
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      redirect: "follow",
      referrer: "no-referrer",
      ...options,
    } as any;

    const url = this.host + PATH;

    return fetch(url, options as any);
  }
}

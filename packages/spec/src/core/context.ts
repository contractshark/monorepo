import { Context as ContextBase, AssertionNote } from "@contractshark/logic";
import { Stage } from "./stage";
import { SignatureKind } from "./types";
import { reverts } from "../asserts/reverts";
import { deploy } from "../methods/deploy";
import { tuple } from "../methods/tuple";
import { sign } from "../methods/sign";

/**
 *
 */
export class Context<Data = {}> extends ContextBase<Data> {
  public stage: Stage<Data>;

  /**
   *
   */
  public constructor(stage: Stage<Data>) {
    super(stage);
  }

  /**
   *
   */
  public get web3() {
    return this.stage.web3;
  }

  /**
   *
   */
  public reverts(
    fn: () => any,
    message?: any
  ): AssertionNote | Promise<AssertionNote> {
    return this.assert({
      assertion: "reverts",
      handler: () => reverts(fn, message),
      message,
    });
  }

  /**
   *
   */
  public async deploy(options: {
    src: string;
    contract?: string;
    args?: any[];
    from?: string;
    gas?: number;
    gasPrice?: number;
  }) {
    return deploy({
      web3: this.stage.web3,
      args: [],
      from: await this.stage.web3.eth.getAccounts().then((a) => a[0]),
      gas: 6000000,
      gasPrice: 1,
      ...options,
    });
  }

  /**
   *
   */
  public tuple(obj) {
    return tuple(obj);
  }

  /**
   *
   */
  public async sign(options: {
    data: string;
    kind?: SignatureKind;
    signer?: string;
  }) {
    return sign({
      web3: this.stage.web3,
      signer:
        options.signer === undefined
          ? await this.stage.web3.eth.getAccounts().then((a) => a[0])
          : options.signer,
      kind: options.kind === undefined ? SignatureKind.ETH_SIGN : options.kind,
      ...options,
    });
  }
}

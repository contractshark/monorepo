import { Shark as SharkBase } from "@contractshark/logic";
import { DefaultReporter } from "@contractshark/reporter";
import { Sandbox } from "@contractshark/sandbox";
import { Stage } from "./stage";
import { Context } from "./context";
import Web3 from "web3";

/**
 *
 */
type StageHandler<Data> = (stage: Stage<Data>) => void | Promise<void>;

/**
 *
 */
type ContextHandler<Data> = (
  context: Context<Data>,
  stage: Stage<Data>
) => void | Promise<void>;

/**
 *
 */
export class Shark<Data = {}> extends SharkBase<Data> {
  protected _stage: Stage<Data>;
  public parent: Shark<Data>;

  /**
   *
   */
  public constructor(stage?: Stage<Data>, parent?: Shark<Data>) {
    super(stage, parent);
  }

  /**
   *
   */
  public set stage(s: Stage<Data>) {
    if (this.parent) {
      this.parent.stage = s;
    } else {
      this._stage = s;
    }
  }

  /**
   *
   */
  public get stage() {
    if (this.parent) {
      return this.parent.stage;
    } else {
      return this._stage;
    }
  }

  /**
   *
   */
  public isRoot() {
    return !this.parent;
  }

  /**
   *
   */
  public before(handler: StageHandler<Data>, append: boolean = true) {
    return super.before(handler, append);
  }

  /**
   *
   */
  public beforeEach(handler: ContextHandler<Data>, append: boolean = true) {
    return super.beforeEach(handler, append);
  }

  /**
   *
   */
  public after(handler: StageHandler<Data>, append: boolean = true) {
    return super.after(handler, append);
  }

  /**
   *
   */
  public afterEach(handler: ContextHandler<Data>, append: boolean = true) {
    return super.afterEach(handler, append);
  }

  /**
   *
   */
  public spec(message: string, spec: Shark<Data>) {
    return super.spec(message, spec);
  }

  /**
   *
   */
  public test(message: string, handler: ContextHandler<Data>) {
    return super.test(message, handler);
  }

  /**
   *
   */
  public skip(message: string, handler?: ContextHandler<Data>) {
    return super.skip(message, handler);
  }

  /**
   *
   */
  public only(message: string, handler: ContextHandler<Data>) {
    return super.only(message, handler);
  }

  /**
   *
   */
  protected createStage() {
    const web3 = new Web3(Sandbox.createProvider());
    const reporter = new DefaultReporter();
    return new Stage<Data>(web3, reporter);
  }

  /**
   *
   */
  protected createContext() {
    return new Context<Data>(this.stage);
  }
}

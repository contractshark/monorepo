import { Shark } from "@contractshark/logic";
import * as glob from "fast-glob";

/**
 *
 */
export interface RunnerResult {
  file: string;
  spec: Shark;
}

/**
 *
 */
export interface RunnerOptions {
  cwd?: string;
  deep?: number;
  dot?: boolean;
}

/**
 *
 */
export class Runner {
  protected options: RunnerOptions;
  protected onlyEnabled: boolean = false;
  public results: RunnerResult[] = [];

  /**
   *
   */
  public constructor(options?: RunnerOptions) {
    this.options = {
      cwd: process.cwd(),
      deep: Infinity,
      dot: false,
      ...options,
    };
  }

  /**
   *
   */
  public async require(...patterns: string[]) {
    const options = {
      absolute: true,
      ...this.options,
    };
    const files = (await glob(patterns, options)) as string[];

    files.forEach((file) => {
      const spec = this.loadShark(file);

      if (!spec) {
        return;
      } else if (spec.spec.hasOnly() && !this.onlyEnabled) {
        this.onlyEnabled = true;
        this.results = [];
      }

      if (this.onlyEnabled && spec.spec.hasOnly()) {
        this.results.push(spec);
      } else if (!this.onlyEnabled) {
        this.results.push(spec);
      }
    });
  }

  /**
   *
   */
  public clear() {
    this.results = [];
    return this;
  }

  /**
   *
   * NOTE: Due to different NPM package managers, the `instanceof` check my be
   * inconsistent thus the function checks for presence of the `test` method.
   */
  protected loadShark(file: string) {
    const spec = require(file);

    if (spec instanceof Shark) {
      return { file, spec };
    } else if (spec.default instanceof Shark) {
      return { file, spec: spec.default };
    } else {
      return null;
    }
  }
}

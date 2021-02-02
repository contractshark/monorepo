import { Shark } from "@contractshark/logic";
import * as glob from "fast-glob";

/**
 *
 */
export interface RunnerResult {
  file: string;
  shark: Shark;
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
      const shark = this.loadShark(file);

      if (!shark) {
        return;
      } else if (shark.shark.hasOnly() && !this.onlyEnabled) {
        this.onlyEnabled = true;
        this.results = [];
      }

      if (this.onlyEnabled && shark.shark.hasOnly()) {
        this.results.push(shark);
      } else if (!this.onlyEnabled) {
        this.results.push(shark);
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
    const shark = require(file);

    if (shark instanceof Shark) {
      return { file, shark };
    } else if (shark.default instanceof Shark) {
      return { file, shark: shark.default };
    } else {
      return null;
    }
  }
}

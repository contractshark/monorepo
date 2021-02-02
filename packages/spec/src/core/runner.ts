import { Shark } from "./spec";
import * as runner from "@contractshark/runner";

/**
 *
 */
export interface RunnerResult extends runner.RunnerResult {
  spec: Shark;
}

/**
 *
 */
export class Runner extends runner.Runner {
  public results: RunnerResult[] = [];

  /**
   *
   */
  protected loadShark(file: string) {
    const spec = require(file);

    if (spec instanceof Shark) {
      return { file, spec };
    } else if (spec.default instanceof Shark) {
      return { file, spec: spec.default };
    }
  }
}

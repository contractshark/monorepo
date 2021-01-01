import { Spec } from "./spec";
import * as runner from "@contractshark/runner";

/**
 *
 */
export interface RunnerResult extends runner.RunnerResult {
  spec: Spec;
}

/**
 *
 */
export class Runner extends runner.Runner {
  public results: RunnerResult[] = [];

  /**
   *
   */
  protected loadSpec(file: string) {
    const spec = require(file);

    if (spec instanceof Spec) {
      return { file, spec };
    } else if (spec.default instanceof Spec) {
      return { file, spec: spec.default };
    }
  }
}

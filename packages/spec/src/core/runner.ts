import { Shark } from "./shark";
import * as runner from "@contractshark/runner";

/**
 *
 */
export interface RunnerResult extends runner.RunnerResult {
  shark: Shark;
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
    const shark = require(file);

    if (shark instanceof Shark) {
      return { file, shark };
    } else if (shark.default instanceof Shark) {
      return { file, shark: shark.default };
    }
  }
}

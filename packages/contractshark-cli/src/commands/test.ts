import { Runner, Spec, Stage, Reporter } from "@contractshark/spec";
import { Sandbox } from "@contractshark/sandbox";
import Web3 from "web3";
import { getConfig } from "../lib/env";

/**
 * Runs tests.
 */
export default async function (argv) {
  const config = getConfig(argv);

  const sandbox = new Sandbox(config.test);
  const web3 = new Web3(sandbox.provider);
  const reporter = new Reporter();
  const stage = new Stage(web3, reporter);
  const test = new Spec(stage);

  if (config.test.server) {
    await sandbox.listen();
  }

  const runner = new Runner();
  await runner.require(...config.test.match);
  runner.results.forEach((result) => {
    const message = result.file.substr(process.cwd().length + 1);
    test.spec(message, result.spec);
  });

  try {
    await test.perform();
  } catch (e) {
    console.log(e);
    process.exit(2);
  }

  if (config.test.server) {
    await sandbox.close();
  }

  process.exit(reporter.failedCount ? 1 : 0);
}

import { Compiler, DefaultReporter } from "@contractshark/compiler";
import { getConfig } from "../lib/env";

/**
 * Compiles Solidity contracts.
 */
export default async function (argv) {
  const config = getConfig(argv);
  const compiler = new Compiler({
    settings: {
      optimizer: {
        enabled: config.settings.optimization > 0,
        runs: config.settings.optimization,
      },
      evmVersion: config.compiler.evmVersion,
    },
    reporter: new DefaultReporter(config.compiler.severities),
  });
  await compiler.source(...config.compiler.match);

  try {
    compiler.compile();
    if (config.compiler.clean) {
      compiler.clean();
    }
    compiler.save(config.compiler.build);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(2);
  }
}

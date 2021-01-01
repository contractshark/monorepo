import { Sandbox } from "@contractshark/sandbox";
import { Printer } from "@contractshark/reporter";
import { getConfig } from "../lib/env";

/**
 * Starts Ethereum sandbox server.
 */
export default async function (argv) {
  const config = getConfig(argv);
  const printer = new Printer();

  const sandbox = new Sandbox(config.sandbox);
  try {
    await sandbox.listen();
    printer.end();
    printer.end(printer.indent(1, ""), "Sandbox blockchain");
    printer.end(
      printer.indent(2, ""),
      printer.colorize(
        "gray",
        `Listening at localhost:${config.sandbox.port} ...`
      )
    );
    printer.end();
  } catch (e) {
    console.error(e);
    process.exit(2);
  }

  if (config.sandbox.ttl) {
    setTimeout(() => sandbox.close(), config.sandbox.ttl);
  }
}

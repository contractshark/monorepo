import * as solc from "solc";
import * as fs from "fs";
import * as fsx from "fs-extra";
import * as pth from "path";
import { SolcInput, SolcOutput } from "../lib/solc";
import { DefaultReporter } from "./reporter";
import { Flattener } from "@contractshark/flattener";

/**
 * Solidity compiler configuration object.
 */
export interface CompilerRecipe extends SolcInput {
  cwd?: string;
  reporter?: DefaultReporter;
}

/**
 * Solidity compiler.
 */
export class Compiler {
  protected reporter: DefaultReporter;
  public cwd: string;
  public input: SolcInput;
  public output: SolcOutput = {};

  /**
   * Class constructor.
   * @param recipe Compiler configuration object.
   */
  public constructor(recipe?: CompilerRecipe) {
    this.input = {
      sources: {
        ...(recipe ? recipe.sources : {}),
      },
      language: recipe && recipe.language ? recipe.language : "Solidity",
      settings: {
        evmVersion: "istanbul",
        outputSelection: {
          "*": {
            "*": [
              "ast",
              "abi",
              "metadata",
              "evm.bytecode.object",
              "evm.methodIdentifiers",
            ],
          },
        },
        ...(recipe ? recipe.settings : {}),
      },
    };
    this.cwd = recipe && recipe.cwd ? recipe.cwd : process.cwd();
    this.reporter = recipe && recipe.reporter ? recipe.reporter : null;
  }

  /**
   * Loads sources by pattern.
   * @param patterns File search patterns.
   */
  public async source(...patterns: string[]) {
    const flattener = new Flattener();
    flattener.source(...patterns);
    await flattener.flatten();

    const keys = Object.keys(flattener.output.sources);
    keys.forEach((element) => {
      this.input.sources[element] = {
        content: flattener.output.sources[element],
      };
    });

    return keys.length;
  }

  /**
   * Finds and reads imports.
   * @param path Path to file.
   */
  public findImports(path) {
    path = path.indexOf("./") !== 0 ? `./node_modules/${path}` : path;
    return {
      contents: fs.readFileSync(path).toString(),
    };
  }

  /**
   * Compiles the solc input and memorizes the output.
   */
  public compile() {
    if (this.reporter) {
      this.reporter.onCompileStart(this);
    }

    const input = JSON.stringify(this.input);

    this.output = JSON.parse(solc.compile(input, { import: this.findImports }));

    if (this.reporter) {
      this.reporter.onCompileEnd(this);
    }

    return !Array.isArray(this.output.errors);
  }

  /**
   * Cleans output of unnecessary contracts.
   */
  public clean() {
    try {
      Object.keys(this.output.contracts || {}).forEach((file) => {
        const sourcePath = this.normalizePath(file);
        const isModule = sourcePath.indexOf("./node_modules") === 0;
        if (isModule) {
          return;
        }
        const matcher = new RegExp("(?<=^contract )(.*?)(?= |{|\n)", "gm");
        const contracts = fs.readFileSync(sourcePath).toString().match(matcher);
        const json = this.output.contracts[file];
        Object.keys(json).forEach((contract) => {
          if (contracts && contracts.indexOf(contract) === -1) {
            delete this.output.contracts[file][contract];
          }
        });
      });
    } catch {}
  }

  /**
   * Saves memorized compiler output to destination folder.
   * @param dist Destination folder.
   */
  public save(dist: string) {
    if (this.reporter) {
      this.reporter.onSaveStart(this);
    }

    const target = pth.resolve(this.cwd, dist);
    fsx.ensureDirSync(target);

    let count = 0;
    Object.keys(this.output.contracts || {}).forEach((file) => {
      const sourcePath = this.normalizePath(file);

      const isModule = sourcePath.indexOf("./node_modules") === 0;
      if (isModule) {
        return;
      }

      const fileName = pth.basename(sourcePath);
      const contractName = fileName.split(".").slice(0, -1).join(".");
      const destPath = pth.join(target, `${contractName}.json`);

      const json = this.output.contracts[file];
      Object.keys(json).forEach((contract) => {
        if (json[contract].metadata) {
          json[contract].metadata = JSON.parse(json[contract].metadata);
        }
      });

      const data = JSON.stringify(json, null, 2);
      fs.writeFileSync(destPath, data);

      count++;
    });

    if (this.reporter) {
      this.reporter.onSaveEnd(this);
    }

    return count;
  }

  /**
   * Reinitializes the class.
   */
  public clear() {
    this.output = {};
    return this;
  }

  /**
   * Converts a file path not starting with a dot to match node_modules.
   * @param path File path.
   */
  protected normalizePath(path: string) {
    return path.indexOf("./") !== 0 ? `./node_modules/${path}` : path;
  }
}

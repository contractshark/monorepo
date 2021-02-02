/**
 * File recipe interface.
 */
export interface FileRecipe {
  path: string[];
  content: string[];
}

/**
 * Project files.
 */
export const files = [
  {
    path: [".gitignore"],
    content: [`.DS_Store`, `.vscode`, `node_modules`, `dist`, `build`],
  },
  {
    path: [".npmignore"],
    content: [`.DS_Store`, `.vscode`, `node_modules`],
  },
  {
    path: ["package.json"],
    content: [
      `{`,
      `  "name": "{{ name }}",`,
      `  "description": "{{ description }}",`,
      `  "version": "0.0.0",`,
      `  "scripts": {`,
      `    "compile": "contractshark compile",`,
      `    "sandbox": "contractshark sandbox",`,
      `    "prepare": "contractshark compile",`,
      `    "test": "contractshark compile && contractshark test"`,
      `  },`,
      `  "contractshark": {`,
      `    "compiler": {`,
      `      "build": "./build",`,
      `      "match": [`,
      `        "./src/**/*.sol"`,
      `      ]`,
      `    },`,
      `    "test": {`,
      `      "match": [`,
      `        "./src/**/*.test.*"`,
      `      ]`,
      `    },`,
      `    "require": [`,
      `      "ts-node/register"`,
      `    ]`,
      `  },`,
      `  "license": "MIT",`,
      `  "dependencies": {`,
      `    "@contractshark/cli": "latest",`,
      `    "@contractshark/spec": "latest",`,
      `    "solc": "0.6.1",`,
      `    "ts-node": "8.4.1",`,
      `    "typescript": "3.6.3",`,
      `    "web3": "1.2.0"`,
      `  }`,
      `}`,
    ],
  },
  {
    path: ["src", "contracts", "main.sol"],
    content: [
      `pragma solidity ^0.5.11;`,
      ``,
      `contract Main {`,
      ``,
      `  function works()`,
      `    public`,
      `    pure`,
      `    returns (uint256 _value)`,
      `  {`,
      `    _value = 100;`,
      `  }`,
      ``,
      `}`,
    ],
  },
  {
    path: ["src", "tests", "main.test.ts"],
    content: [
      `import { Shark } from '@contractshark/spec';`,
      ``,
      `const spec = new Shark();`,
      ``,
      `spec.test('returns boolean', async (ctx) => {`,
      `  const main = await ctx.deploy({`,
      `    src: './build/main.json',`,
      `    contract: 'Main',`,
      `  });`,
      `  const value = await main.instance.methods.works().call();`,
      `  ctx.is(value, '100');`,
      `});`,
      ``,
      `export default spec;`,
    ],
  },
  {
    path: ["tsconfig.json"],
    content: [
      `{`,
      `  "compilerOptions": {`,
      `    "module": "commonjs",`,
      `    "target": "es6"`,
      `  }`,
      `}`,
    ],
  },
] as FileRecipe[];

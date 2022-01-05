### `runner`

> This package provides the logic for discovering and performing test files.

```ts
import { Spec } from "@contractshark/logic";
import { Runner } from "@contractshark/runner";

const runner = new Runner();
runner.require("./foo/**/*.test.js", "!./foo/**/foo.test.js");
runner.require("./bar/*.hay.js");

const spec = new Spec();
runner.specs.forEach((folder, spec) => {
  spec.spec(filder, spec);
});
spec.perform();
```

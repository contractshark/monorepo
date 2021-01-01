import * as browser from "./browser";
import * as node from "./node";

const a: typeof browser = node;
const b: typeof node = browser;

function containsKeys(a: any, b: any) {
  for (let k in a) {
    if (!(k in b)) return false;
  }
  return true;
}

// algebraic equality
containsKeys(a, b);
containsKeys(b, a);

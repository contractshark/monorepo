import test from "ava";
import * as spec from "..";

test("exposes Context class", async (t) => {
  t.true(!!spec.Context);
});

test("exposes Runner class", async (t) => {
  t.true(!!spec.Runner);
});

test("exposes Shark class", async (t) => {
  t.true(!!spec.Shark);
});

test("exposes Stage class", async (t) => {
  t.true(!!spec.Stage);
});

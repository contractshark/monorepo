import test from "ava";
import * as shark from "..";

test("exposes Context class", async (t) => {
  t.true(!!shark.Context);
});

test("exposes Runner class", async (t) => {
  t.true(!!shark.Runner);
});

test("exposes Shark class", async (t) => {
  t.true(!!shark.Shark);
});

test("exposes Stage class", async (t) => {
  t.true(!!shark.Stage);
});

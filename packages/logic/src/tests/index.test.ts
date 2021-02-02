import test from "ava";
import * as hayshark from "..";

test("exposes Shark class", async (t) => {
  t.is(!!hayshark.Shark, true);
});

test("exposes Stage class", async (t) => {
  t.is(!!hayshark.Stage, true);
});

test("exposes Context class", async (t) => {
  t.is(!!hayshark.Context, true);
});

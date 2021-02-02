import test from "ava";
import { Shark } from "../..";

test("method isRoot() indicates if the shark is nested or not", async (t) => {
  const results = [];
  const shark1 = new Shark();
  const shark0 = new Shark();
  shark0.shark("", shark1);
  await shark0.perform();
  t.true(shark0.isRoot());
  t.false(shark1.isRoot());
});

test("method perform() executes shark stack", async (t) => {
  const results = [];
  const shark1 = new Shark();
  shark1.before(() => {
    results.push("1-before-0");
  });
  shark1.after(() => {
    results.push("1-after-0");
  });
  shark1.beforeEach(() => {
    results.push("1-beforeeach-0");
  });
  shark1.afterEach(() => {
    results.push("1-aftereach-0");
  });
  shark1.test("", () => {
    results.push("1-0");
  });
  shark1.test("", () => {
    results.push("1-1");
  });
  const shark0 = new Shark();
  shark0.test("", () => {
    results.push("0-0");
  });
  shark0.before(() => {
    results.push("0-before-0");
  });
  shark0.before(() => {
    results.push("0-before-1");
  });
  shark0.beforeEach(() => {
    results.push("0-beforeeach-0");
  });
  shark0.beforeEach(() => {
    results.push("0-beforeeach-1");
  });
  shark0.after(() => {
    results.push("0-after-0");
  });
  shark0.afterEach(() => {
    results.push("0-aftereach-0");
  });
  shark0.before(() => {
    results.push("0-before-2");
  });
  shark0.beforeEach(() => {
    results.push("0-beforeeach-2");
  });
  shark0.after(() => {
    results.push("0-after-1");
  });
  shark0.after(() => {
    results.push("0-after-2");
  });
  shark0.afterEach(() => {
    results.push("0-aftereach-1");
  });
  shark0.afterEach(() => {
    results.push("0-aftereach-2");
  });
  shark0.shark("", shark1);
  shark0.shark("", shark1);
  shark0.test("", () => {
    results.push("0-1");
  });
  await shark0.perform();
  t.deepEqual(results, [
    "0-before-0",
    "0-before-1",
    "0-before-2",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-beforeeach-2",
    "0-0",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-aftereach-2",
    "1-before-0",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-beforeeach-2",
    "1-beforeeach-0",
    "1-0",
    "1-aftereach-0",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-aftereach-2",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-beforeeach-2",
    "1-beforeeach-0",
    "1-1",
    "1-aftereach-0",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-aftereach-2",
    "1-after-0",
    "1-before-0",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-beforeeach-2",
    "1-beforeeach-0",
    "1-0",
    "1-aftereach-0",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-aftereach-2",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-beforeeach-2",
    "1-beforeeach-0",
    "1-1",
    "1-aftereach-0",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-aftereach-2",
    "1-after-0",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-beforeeach-2",
    "0-1",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-aftereach-2",
    "0-after-0",
    "0-after-1",
    "0-after-2",
  ]);
});

test("method perform() ignores skipped tests", async (t) => {
  const results = [];
  const shark0 = new Shark();
  shark0.skip("", () => {
    results.push("0-0");
  });
  shark0.before(() => {
    results.push("0-before-0");
  });
  shark0.beforeEach(() => {
    results.push("0-beforeeach-0");
  });
  shark0.after(() => {
    results.push("0-after-0");
  });
  shark0.afterEach(() => {
    results.push("0-aftereach-0");
  });
  shark0.before(() => {
    results.push("0-before-1");
  });
  shark0.beforeEach(() => {
    results.push("0-beforeeach-1");
  });
  shark0.after(() => {
    results.push("0-after-1");
  });
  shark0.afterEach(() => {
    results.push("0-aftereach-1");
  });
  shark0.test("", () => {
    results.push("0-1");
  });
  await shark0.perform();
  t.deepEqual(results, [
    "0-before-0",
    "0-before-1",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-1",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-after-0",
    "0-after-1",
  ]);
});

test("method perform() performs only selected tests", async (t) => {
  const results = [];
  const shark0 = new Shark();
  shark0.before(() => {
    results.push("0-before-0");
  });
  shark0.beforeEach(() => {
    results.push("0-beforeeach-0");
  });
  shark0.after(() => {
    results.push("0-after-0");
  });
  shark0.afterEach(() => {
    results.push("0-aftereach-0");
  });
  shark0.before(() => {
    results.push("0-before-1");
  });
  shark0.beforeEach(() => {
    results.push("0-beforeeach-1");
  });
  shark0.after(() => {
    results.push("0-after-1");
  });
  shark0.afterEach(() => {
    results.push("0-aftereach-1");
  });
  shark0.test("", () => {
    results.push("0-0");
  });
  shark0.only("", () => {
    results.push("0-1");
  });
  shark0.test("", () => {
    results.push("0-2");
  });
  await shark0.perform();
  t.deepEqual(results, [
    "0-before-0",
    "0-before-1",
    "0-beforeeach-0",
    "0-beforeeach-1",
    "0-1",
    "0-aftereach-0",
    "0-aftereach-1",
    "0-after-0",
    "0-after-1",
  ]);
});

test("method shark() appends new shark with shared stage instance", async (t) => {
  const shark2 = new Shark();
  const shark1 = new Shark();
  const shark0 = new Shark();
  shark1.shark("", shark2);
  shark0.shark("", shark1);
  t.true(shark2.stage === shark1.stage);
  t.true(shark2.stage === shark0.stage);
  t.true(shark1.stage === shark0.stage);
});

test("context instance is shared between atomic stack", async (t) => {
  const shark = new Shark();
  const ctxs = [];
  shark.beforeEach((ctx) => {
    ctxs.push(ctx);
  });
  shark.test("", (ctx) => {
    ctxs.push(ctx);
  });
  shark.afterEach((ctx) => {
    ctxs.push(ctx);
  });
  t.true(ctxs[0] === ctxs[1]);
  t.true(ctxs[1] === ctxs[2]);
  t.true(ctxs[0] === ctxs[2]);
});

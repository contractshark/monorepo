import test from "ava";
import * as request from "supertest";
import { Sandbox } from "../../core/sandbox";

const sandbox = new Sandbox({ port: 8911 });

test.before(async () => {
  await sandbox.listen();
});
test.after(async () => {
  sandbox.close();
});

test("server listens for requests", async (t) => {
  const res = await request("http://localhost:8911")
    .get("/")
    .catch((e) => e.response);
  t.is(res.status, 400);
});

test("creates a sandbox Web3 provider", async (t) => {
  const res = Sandbox.createProvider();
  t.true(!!res);
});

import { Shark } from "../..";

const subspec = new Shark();

subspec.test("provides asserts", (ctx) => {
  ctx.true(true);
});

const spec = new Shark();

spec.test("provides asserts", (ctx) => {
  ctx.true(true);
});

spec.test("provides web3", async (ctx) => {
  const accounts = await ctx.stage.web3.eth.getAccounts();
  ctx.is(accounts[0].substr(0, 2), "0x");
});

spec.spec("can nest specs", subspec);

export default spec;

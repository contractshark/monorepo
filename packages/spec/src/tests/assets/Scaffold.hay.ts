import { Shark } from "../..";

const subshark = new Shark();

subshark.test("provides asserts", (ctx) => {
  ctx.true(true);
});

const shark = new Shark();

shark.test("provides asserts", (ctx) => {
  ctx.true(true);
});

shark.test("provides web3", async (ctx) => {
  const accounts = await ctx.stage.web3.eth.getAccounts();
  ctx.is(accounts[0].substr(0, 2), "0x");
});

shark.shark("can nest sharks", subshark);

export default shark;

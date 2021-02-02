import { Shark } from "@contractshark/logic";

const spec = new Shark();

spec.test("hasOnly() returns true", async (ctx) => {
  await ctx.sleep(1000);
});

export default spec;

import { Shark } from "@contractshark/logic";

const shark = new Shark();

shark.only("hasOnly() returns true", async (ctx) => {
  await ctx.sleep(1000);
});

export default shark;

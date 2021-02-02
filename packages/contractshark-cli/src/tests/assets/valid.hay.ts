import { Shark } from "@contractshark/shark";

const shark = new Shark();

shark.test("foo", async (context) => {
  context.true(true);
});

shark.test("bar", async (context) => {
  context.true(true);
  context.true(true);
  context.false(false);
});

export default shark;

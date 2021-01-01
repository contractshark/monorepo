import { Spec } from "@contractshark/spec";

const spec = new Spec();

spec.test("foo", async (context) => {
  context.true(true);
});

spec.test("bar", async (context) => {
  context.true(false);
});

export default spec;

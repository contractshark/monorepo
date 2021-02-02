import test from "ava";
import { Reporter } from "../../core/reporter";

test("triggers recipe callbacks", async (t) => {
  const stat = {
    onBegin: 0,
    onEnd: 0,
    onNote: 0,
    onSharkStartNote: 0,
    onSharkEndNote: 0,
    onTestStartNote: 0,
    onTestEndNote: 0,
    onAssertionNote: 0,
  };
  const reporter = new Reporter({
    onBegin: () => stat.onBegin++,
    onEnd: () => stat.onEnd++,
    onNote: () => stat.onNote++,
    onSharkStartNote: () => stat.onSharkStartNote++,
    onSharkEndNote: () => stat.onSharkEndNote++,
    onTestStartNote: () => stat.onTestStartNote++,
    onTestEndNote: () => stat.onTestEndNote++,
    onAssertionNote: () => stat.onAssertionNote++,
  });
  reporter.begin();
  reporter.note({
    type: "SharkStartNote",
    message: "foo",
  });
  reporter.note({
    type: "SharkEndNote",
    duration: 0,
  });
  reporter.note({
    type: "TestStartNote",
    message: "foo",
    perform: true,
  });
  reporter.note({
    type: "TestEndNote",
    duration: 0,
  });
  reporter.note({
    type: "AssertionNote",
    message: "foo",
    assertion: "is",
    success: true,
  });
  reporter.end();
  t.deepEqual(stat, {
    onBegin: 1,
    onEnd: 1,
    onNote: 5,
    onSharkStartNote: 1,
    onSharkEndNote: 1,
    onTestStartNote: 1,
    onTestEndNote: 1,
    onAssertionNote: 1,
  });
});

test("memorizes spec block level", async (t) => {
  const reporter = new Reporter();
  reporter.note({
    type: "SharkStartNote",
    message: "foo",
  });
  reporter.note({
    type: "TestStartNote",
    message: "foo",
    perform: true,
  });
  reporter.note({
    type: "SharkEndNote",
    duration: 0,
  });
  t.is(reporter.level, 1);
});

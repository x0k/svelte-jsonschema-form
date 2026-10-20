import { afterEach, describe, expect, test, vi } from "vitest";

import logOnce, { LOG_ONCE_MAX_MESSAGES, resetLogOnce } from "./log-once.js";

describe("logOnce", () => {
  afterEach(() => {
    resetLogOnce();
    vi.restoreAllMocks();
  });

  test("logs the same message only once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    logOnce("message");
    logOnce("message");
    expect(warn).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledWith("message");
  });

  test("logs the same message at different levels", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    logOnce("message");
    logOnce("message", "error");
    expect(warn).toHaveBeenCalledOnce();
    expect(error).toHaveBeenCalledOnce();
  });

  test("distinguishes an absent error from an empty one", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    logOnce("message");
    logOnce("message", "warn", "");
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenLastCalledWith("message", "");
  });

  test("deduplicates errors by their string form", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    logOnce("message", "warn", new Error("broken"));
    logOnce("message", "warn", new Error("broken"));
    expect(warn).toHaveBeenCalledOnce();
  });

  test("does not throw when an error cannot be converted", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = {
      toString() {
        throw new Error("no string form");
      },
    };
    expect(() => logOnce("message", "warn", error)).not.toThrow();
    expect(() => logOnce("message", "warn", error)).not.toThrow();
    expect(warn).toHaveBeenCalledOnce();
  });

  test("remembers messages across a generation", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    logOnce("first");
    for (let i = 0; i < LOG_ONCE_MAX_MESSAGES; i++) {
      logOnce(`message-${i}`);
    }
    logOnce("first");
    expect(
      warn.mock.calls.filter(([message]) => message === "first")
    ).toHaveLength(1);
  });

  test("forgets messages after a reset", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    logOnce("message");
    resetLogOnce();
    logOnce("message");
    expect(warn).toHaveBeenCalledTimes(2);
  });
});

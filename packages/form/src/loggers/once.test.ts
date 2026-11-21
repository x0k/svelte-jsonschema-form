import { describe, expect, it, vi } from "vitest";

import { createLogger } from "./once.js";

function createTestSink() {
  return {
    warn: vi.fn(),
    error: vi.fn(),
  };
}

describe("createLogger()", () => {
  it("reports each distinct message once", () => {
    const sink = createTestSink();
    const logger = createLogger({ sink });
    logger.warn("first");
    logger.warn("first");
    logger.warn("second");
    expect(sink.warn.mock.calls).toEqual([["first"], ["second"]]);
  });

  it("tracks warn and error separately", () => {
    const sink = createTestSink();
    const logger = createLogger({ sink });
    logger.warn("message");
    logger.error("message");
    logger.warn("message");
    logger.error("message");
    expect(sink.warn).toHaveBeenCalledTimes(1);
    expect(sink.error).toHaveBeenCalledTimes(1);
  });

  it("distinguishes errors attached to the same message", () => {
    const sink = createTestSink();
    const logger = createLogger({ sink });
    const first = new Error("first");
    const second = new Error("second");
    logger.warn("message", first);
    logger.warn("message", first);
    logger.warn("message", second);
    expect(sink.warn.mock.calls).toEqual([
      ["message", first],
      ["message", second],
    ]);
  });

  it("keeps logging when the error cannot be converted to a string", () => {
    const sink = createTestSink();
    const logger = createLogger({ sink });
    const error = {
      toString() {
        throw new Error("cannot convert");
      },
    };
    expect(() => logger.warn("message", error)).not.toThrow();
    expect(() => logger.warn("message", error)).not.toThrow();
    expect(sink.warn).toHaveBeenCalledTimes(1);
  });
});

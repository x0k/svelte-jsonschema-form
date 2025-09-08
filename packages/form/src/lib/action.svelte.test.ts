/* eslint-disable @typescript-eslint/no-deprecated */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tick } from "svelte";

import {
  abortPrevious,
  forgetPrevious,
  waitPrevious,
  createAction,
  CompletionError,
  InitializationError,
} from "./action.svelte.js";
import { noop } from "./function.js";

describe("createAction", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("Status", () => {
    it("Should correctly update status during success flow", async () => {
      const action = createAction({
        execute: () => Promise.resolve(),
        delayedMs: 50,
        timeoutMs: 100,
      });
      const promise = action.runAsync();
      expect(action.status).toBe("processing");
      await promise;
      expect(action.status).toBe("success");
      vi.advanceTimersByTime(50);
      expect(action.status).toBe("success");
      vi.advanceTimersByTime(50);
      expect(action.status).toBe("success");
    });

    it("Should correctly update status during error flow", async () => {
      const action = createAction({
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        execute: () => Promise.reject(),
        delayedMs: 50,
        timeoutMs: 100,
      });
      const promise = action.runAsync().catch(noop);
      expect(action.status).toBe("processing");
      await promise;
      expect(action.status).toBe("failed");
      vi.advanceTimersByTime(50);
      expect(action.status).toBe("failed");
      vi.advanceTimersByTime(50);
      expect(action.status).toBe("failed");
    });

    it("Should correctly update statuses: processed -> processed(delayed) -> failed(timeout)", async () => {
      const action = createAction({
        execute: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0);
            }, 100);
          }),
        delayedMs: 10,
        timeoutMs: 50,
      });
      action.run();
      expect(action.status).toBe("processing");
      expect(action.isDelayed).toBe(false);
      vi.advanceTimersByTime(10);
      expect(action.status).toBe("processing");
      expect(action.isDelayed).toBe(true);
      vi.advanceTimersByTime(40);
      if (action.state.status === "failed") {
        expect(action.state.reason).toBe("timeout");
      } else {
        expect.fail();
      }
      vi.advanceTimersByTime(50);
      await tick();
      expect(action.status).toBe("failed");
    });

    it("Should throw `InitializationError` if combinator returns false", async () => {
      const action = createAction({
        execute: () => Promise.resolve(0),
        combinator: () => false,
      });
      await expect(action.runAsync()).rejects.toThrow(InitializationError);
    });

    it("Should throw `CompletionError` if resolved in failed state", async () => {
      const p = Promise.withResolvers<boolean>();
      const action = createAction({
        execute: () => p.promise,
      });
      const actionPromise = action.runAsync();
      action.abort();
      p.resolve(true);
      await expect(actionPromise).rejects.toBeInstanceOf(CompletionError);
    });
  });
  describe("Combinator", () => {
    it("Should ignore new action until the previous action is completed", async () => {
      const impl = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0);
            }, 100);
          })
      );
      const action = createAction({
        execute: impl,
        combinator: waitPrevious,
      });
      action.run();
      action.run();
      vi.advanceTimersByTime(100);
      await tick();
      action.run();
      expect(impl).toBeCalledTimes(2);
    });

    it("Should forget previous action with 'forgetPrevious' combinator", async () => {
      let count = 0;
      const onSuccess = vi.fn();
      const action = createAction({
        execute: () => Promise.resolve(count++),
        combinator: forgetPrevious,
        onSuccess,
      });
      const actionPromise1 = action.runAsync();
      await expect(action.runAsync()).resolves.toBe(1);
      await expect(actionPromise1).resolves.toBe(0);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith(1);
    });

    it("Should abort previous action with 'abortPrevious' combinator", async () => {
      const onAbort = vi.fn();
      let count = 0;
      const impl = vi.fn((signal: AbortSignal) => {
        signal.addEventListener("abort", onAbort);
        return Promise.resolve(count++);
      });
      const onSuccess = vi.fn();
      const action = createAction({
        execute: impl,
        combinator: abortPrevious,
        onSuccess,
      });
      action.run();
      action.run();
      await action.runAsync();
      expect(onAbort).toBeCalledTimes(2);
      expect(impl).toBeCalledTimes(3);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith(2);
    });

    it("Should not track action with 'untrack' combinator", async () => {
      const action = createAction({
        execute: () => Promise.resolve(0),
        combinator: () => "untrack",
      });
      const promise = action.runAsync();
      expect(action.status).toBe("idle");
      await expect(promise).resolves.toBe(0);
    });
  });
});

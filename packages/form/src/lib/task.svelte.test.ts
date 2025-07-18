import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tick } from "svelte";

import {
  abortPrevious,
  forgetPrevious,
  waitPrevious,
  createTask,
  CompletionError,
  InitializationError,
} from "./task.svelte.js";
import { noop } from "./function.js";

describe("createTask", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("Status", () => {
    it("Should correctly update status during success flow", async () => {
      const task = createTask({
        execute: () => Promise.resolve(),
        delayedMs: 50,
        timeoutMs: 100,
      });
      const promise = task.runAsync();
      expect(task.status).toBe("processing");
      await promise;
      expect(task.status).toBe("success");
      vi.advanceTimersByTime(50);
      expect(task.status).toBe("success");
      vi.advanceTimersByTime(50);
      expect(task.status).toBe("success");
    });

    it("Should correctly update status during error flow", async () => {
      const task = createTask({
        execute: () => Promise.reject(),
        delayedMs: 50,
        timeoutMs: 100,
      });
      const promise = task.runAsync().catch(noop);
      expect(task.status).toBe("processing");
      await promise;
      expect(task.status).toBe("failed");
      vi.advanceTimersByTime(50);
      expect(task.status).toBe("failed");
      vi.advanceTimersByTime(50);
      expect(task.status).toBe("failed");
    });

    it("Should correctly update statuses: processed -> processed(delayed) -> failed(timeout)", async () => {
      const task = createTask({
        execute: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0);
            }, 100);
          }),
        delayedMs: 10,
        timeoutMs: 50,
      });
      task.run();
      expect(task.status).toBe("processing");
      expect(task.isDelayed).toBe(false);
      vi.advanceTimersByTime(10);
      expect(task.status).toBe("processing");
      expect(task.isDelayed).toBe(true);
      vi.advanceTimersByTime(40);
      if (task.state.status === "failed") {
        expect(task.state.reason).toBe("timeout");
      } else {
        expect.fail();
      }
      vi.advanceTimersByTime(50);
      await tick();
      expect(task.status).toBe("failed");
    });

    it("Should throw `InitializationError` if combinator returns false", async () => {
      const task = createTask({
        execute: () => Promise.resolve(0),
        combinator: () => false,
      });
      await expect(task.runAsync()).rejects.toThrow(InitializationError);
    });

    it("Should throw `CompletionError` if resolved in failed state", async () => {
      const p = Promise.withResolvers<boolean>();
      const task = createTask({
        execute: () => p.promise,
      });
      const taskPromise = task.runAsync();
      task.abort();
      p.resolve(true);
      await expect(taskPromise).rejects.toBeInstanceOf(CompletionError);
    });
  });
  describe("Combinator", () => {
    it("Should ignore new tasks until the previous task is completed", async () => {
      const impl = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0);
            }, 100);
          })
      );
      const task = createTask({
        execute: impl,
        combinator: waitPrevious,
      });
      task.run();
      task.run();
      vi.advanceTimersByTime(100);
      await tick();
      task.run();
      expect(impl).toBeCalledTimes(2);
    });

    it("Should forget previous task with 'forgetPrevious' combinator", async () => {
      let count = 0;
      const onSuccess = vi.fn();
      const task = createTask({
        execute: () => Promise.resolve(count++),
        combinator: forgetPrevious,
        onSuccess,
      });
      const taskPromise1 = task.runAsync();
      await expect(task.runAsync()).resolves.toBe(1);
      await expect(taskPromise1).resolves.toBe(0);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith(1);
    });

    it("Should abort previous task with 'abortPrevious' combinator", async () => {
      const onAbort = vi.fn();
      let count = 0;
      const impl = vi.fn((signal: AbortSignal) => {
        signal.addEventListener("abort", onAbort);
        return Promise.resolve(count++);
      });
      const onSuccess = vi.fn();
      const task = createTask({
        execute: impl,
        combinator: abortPrevious,
        onSuccess,
      });
      task.run();
      task.run();
      await task.runAsync();
      expect(onAbort).toBeCalledTimes(2);
      expect(impl).toBeCalledTimes(3);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith(2);
    });

    it("Should not track task with 'untrack' combinator", async () => {
      const task = createTask({
        execute: () => Promise.resolve(0),
        combinator: () => "untrack",
      });
      const promise = task.runAsync();
      expect(task.status).toBe("idle");
      await expect(promise).resolves.toBe(0);
    });
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { tick } from 'svelte';

import {
  abortPrevious,
  forgetPrevious,
  ignoreNewUntilPreviousIsFinished,
  Status,
  useMutation,
} from "./use-mutation.svelte.js";

describe("useMutation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("Status", () => {
    it("Should correctly update status during success flow", async () => {
      const mutation = useMutation({
        mutate: () => Promise.resolve(),
        delayedMs: 50,
        timeoutMs: 100,
      });
      const promise = mutation.run(undefined);
      expect(mutation.status).toBe(Status.Processed);
      await promise;
      expect(mutation.status).toBe(Status.Success);
      vi.advanceTimersByTime(50);
      expect(mutation.status).toBe(Status.Success);
      vi.advanceTimersByTime(50);
      expect(mutation.status).toBe(Status.Success);
    });
    it("Should correctly update status during error flow", async () => {
      const mutation = useMutation({
        mutate: () => Promise.reject(),
        delayedMs: 50,
        timeoutMs: 100,
      });
      const promise = mutation.run(undefined);
      expect(mutation.status).toBe(Status.Processed);
      await promise;
      expect(mutation.status).toBe(Status.Failed);
      vi.advanceTimersByTime(50);
      expect(mutation.status).toBe(Status.Failed);
      vi.advanceTimersByTime(50);
      expect(mutation.status).toBe(Status.Failed);
    });
    it("Should correctly update statuses: processed -> processed(delayed) -> failed(timeout)", async () => {
      const mutation = useMutation({
        mutate: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0);
            }, 100);
          }),
        delayedMs: 10,
        timeoutMs: 50,
      });
      mutation.run(undefined);
      expect(mutation.status).toBe(Status.Processed);
      expect(mutation.isDelayed).toBe(false);
      vi.advanceTimersByTime(10);
      expect(mutation.status).toBe(Status.Processed);
      expect(mutation.isDelayed).toBe(true);
      vi.advanceTimersByTime(40);
      if (mutation.state.status === Status.Failed) {
        expect(mutation.state.reason).toBe("timeout");
      } else {
        expect.fail()
      }
      vi.advanceTimersByTime(50);
      await tick();
      expect(mutation.status).toBe(Status.Failed);
    });
  });
  describe("Combinator", () => {
    it("Should ignore new mutation until the previous mutation is completed", async () => {
      const impl = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0);
            }, 100);
          })
      );
      const mutation = useMutation({
        mutate: impl,
        combinator: ignoreNewUntilPreviousIsFinished,
      });
      mutation.run(undefined);
      mutation.run(undefined);
      vi.advanceTimersByTime(100);
      await tick();
      mutation.run(undefined);
      expect(impl).toBeCalledTimes(2);
    });
    it("Should forget previous mutation with 'forgetPrevious' combinator", async () => {
      let count = 0;
      const onSuccess = vi.fn();
      const mutation = useMutation({
        mutate: () => Promise.resolve(count++),
        combinator: forgetPrevious,
        onSuccess,
      });
      mutation.run(undefined);
      await mutation.run(undefined);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith(1);
    });
    it("Should abort previous mutation with 'abortPrevious' combinator", async () => {
      const onAbort = vi.fn();
      let count = 0;
      const impl = vi.fn((signal: AbortSignal) => {
        signal.addEventListener("abort", onAbort);
        return Promise.resolve(count++);
      });
      const onSuccess = vi.fn();
      const mutation = useMutation({
        mutate: impl,
        combinator: abortPrevious,
        onSuccess,
      });
      mutation.run(undefined);
      mutation.run(undefined);
      await mutation.run(undefined);
      expect(onAbort).toBeCalledTimes(2);
      expect(impl).toBeCalledTimes(3);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith(2);
    });
  });
});

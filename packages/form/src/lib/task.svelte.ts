import { DEV } from "esm-env";
import { untrack } from "svelte";

import { noop } from "./function.js";

export type Status = "idle" | "processing" | "success" | "failed";

export interface AbstractTaskState<S extends Status> {
  status: S;
}

export type TaskFailureReason = "timeout" | "aborted" | "error";

export interface AbstractFailedTask<R extends TaskFailureReason>
  extends AbstractTaskState<"failed"> {
  reason: R;
}

export interface TaskFailedByError<E> extends AbstractFailedTask<"error"> {
  error: E;
}

export type FailedTask<E> =
  | TaskFailedByError<E>
  | AbstractFailedTask<"timeout">
  | AbstractFailedTask<"aborted">;

export interface ProcessingTask<T, R> extends AbstractTaskState<"processing"> {
  delayed: boolean;
  args: T;
  promise: Promise<R>;
  abortController: AbortController;
}

export type TaskState<T, R, E> =
  | AbstractTaskState<"idle">
  | ProcessingTask<T, R>
  | AbstractTaskState<"success">
  | FailedTask<E>;

export type TasksCombinatorDecision = boolean | "abort" | "untrack";

export type TasksCombinator<T, R, E> = (
  state: TaskState<T, R, E>
) => TasksCombinatorDecision;

export interface TaskOptions<T extends ReadonlyArray<any>, R, E> {
  execute: (signal: AbortSignal, ...args: T) => Promise<R>;
  onSuccess?: (result: R, ...args: T) => void;
  onFailure?: (failure: FailedTask<E>, ...args: T) => void;
  /**
   * The `combinator` runtime error is interpreted as `false`.
   * @default waitPrevious
   */
  combinator?: TasksCombinator<T, R, E>;
  /**
   * @default 500
   */
  delayedMs?: number;
  /**
   * @default 8000
   */
  timeoutMs?: number;
}

/**
 * Forget previous task
 */
export const forgetPrevious: TasksCombinator<any, any, any> = () => true;

/**
 * Abort previous task
 */
export const abortPrevious: TasksCombinator<any, any, any> = () => "abort";

/**
 * Ignore new tasks until the previous task is completed
 */
export const waitPrevious: TasksCombinator<any, any, any> = ({ status }) =>
  status !== "processing";

export function throttle<T, R, E>(
  combinator: TasksCombinator<T, R, E>,
  delayedMs: number
): TasksCombinator<T, R, E> {
  let nextCallAfter = 0;
  return (state) => {
    const now = Date.now();
    if (now < nextCallAfter) {
      return false;
    }
    nextCallAfter = now + delayedMs;
    return combinator(state);
  };
}

export class InitializationError<T, R, E> {
  constructor(public readonly state: TaskState<T, R, E>) {}
}
export class CompletionError<E> {
  constructor(public readonly state: FailedTask<E>) {}
}

export interface Task<T extends ReadonlyArray<any>, R, E> {
  readonly state: Readonly<TaskState<T, R, E>>;
  readonly status: Status;
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isProcessed: boolean;
  readonly isDelayed: boolean;
  matches<S extends Status>(
    status: S
  ): this is Task<T, R, E> & {
    status: S;
    state: Readonly<Extract<TaskState<T, R, E>, AbstractTaskState<S>>>;
  };
  /**
   * Initiates the task without waiting for its result.
   * Any side effects or failures are handled internally.
   */
  run(...args: T): void;

  /**
   * Initiates the task and returns a promise that resolves when the task completes.
   * Use this method when you need to handle the result or catch errors.
   * @throws {InitializationError} if combinator returns `false`.
   * @throws {CompletionError} if task were aborted or timeouted.
   */
  runAsync(...args: T): Promise<R>;

  /**
   * Aborts the ongoing task if it is currently processing.
   * The task will fail with an "aborted" reason and trigger any associated failure callbacks.
   */
  abort(): void;
}

export function createTask<
  T extends ReadonlyArray<any>,
  R = unknown,
  E = unknown,
>(options: TaskOptions<T, R, E>): Task<T, R, E> {
  const delayedMs = $derived(options.delayedMs ?? 500);
  const timeoutMs = $derived(options.timeoutMs ?? 8000);

  if (DEV) {
    $effect(() => {
      if (timeoutMs < delayedMs) {
        throw new Error("timeoutMs must be greater than delayedMs");
      }
    });
  }
  const combinator = $derived(options.combinator ?? waitPrevious);

  let state = $state.raw<TaskState<T, R, E>>({
    status: "idle",
  });
  let delayedCallbackId: NodeJS.Timeout;
  let timeoutCallbackId: NodeJS.Timeout;

  function clearTimeouts() {
    clearTimeout(delayedCallbackId);
    clearTimeout(timeoutCallbackId);
  }

  function abort(state: ProcessingTask<T, R>) {
    state.abortController.abort();
  }

  function runEffect(promise: Promise<R>, effect: () => void) {
    if (state.status === "failed") {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new CompletionError(state);
    }
    if (state.status === "processing" && state.promise === promise) {
      clearTimeouts();
      effect();
    }
  }

  function initAbortController(decision: TasksCombinatorDecision) {
    if (state.status === "processing") {
      if (decision !== "abort") {
        return state.abortController;
      }
      abort(state);
    }
    return new AbortController();
  }

  async function run(decision: TasksCombinatorDecision, args: T): Promise<R> {
    if (decision === false) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new InitializationError(state);
    }
    const abortController = initAbortController(decision);
    const cleanPromise = options.execute(abortController.signal, ...args);
    if (decision === "untrack") {
      return cleanPromise;
    }
    const promise = cleanPromise.then(
      (result) => {
        runEffect(promise, () => {
          state = { status: "success" };
          options.onSuccess?.(result, ...args);
        });
        return result;
      },
      (error) => {
        runEffect(promise, () => {
          state = { status: "failed", reason: "error", error: error as E };
          options.onFailure?.(state, ...args);
        });
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(error);
      }
    );
    state = {
      status: "processing",
      delayed: task.isDelayed,
      args,
      promise,
      abortController,
    };
    clearTimeouts();
    delayedCallbackId = setTimeout(() => {
      if (state.status !== "processing" || state.promise !== promise) return;
      state = {
        ...state,
        delayed: true,
      };
    }, delayedMs);
    timeoutCallbackId = setTimeout(() => {
      if (state.status !== "processing" || state.promise !== promise) return;
      // NOTE: The `clearTimeouts` call is not needed here
      abort(state);
      state = { status: "failed", reason: "timeout" };
      options.onFailure?.(state, ...args);
    }, timeoutMs);
    return promise;
  }

  // NOTE: call `combinator` synchronously to propagate possible error even
  // during `run` call
  function decideAndRun(args: T) {
    return untrack(() => run(combinator(state), args));
  }

  const task: Task<T, R, E> = {
    get state() {
      return state;
    },
    get status() {
      return state.status;
    },
    get isSuccess() {
      return state.status === "success";
    },
    get isFailed() {
      return state.status === "failed";
    },
    get isProcessed() {
      return state.status === "processing";
    },
    get isDelayed() {
      return state.status === "processing" && state.delayed;
    },
    matches<S extends Status>(
      status: S
    ): this is Task<T, R, E> & {
      status: S;
      state: Readonly<Extract<TaskState<T, R, E>, AbstractTaskState<S>>>;
    } {
      return state.status === status;
    },
    run(...args) {
      void decideAndRun(args).catch(noop);
    },
    runAsync(...args) {
      return decideAndRun(args);
    },
    abort() {
      untrack(() => {
        if (state.status !== "processing") return;
        const { args } = state;
        abort(state);
        clearTimeouts();
        state = { status: "failed", reason: "aborted" };
        options.onFailure?.(state, ...args);
      });
    },
  };
  return task;
}

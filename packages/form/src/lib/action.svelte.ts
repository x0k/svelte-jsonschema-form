/* eslint-disable @typescript-eslint/no-deprecated */
import { DEV } from "esm-env";
import { untrack } from "svelte";

import { noop } from "./function.js";

export type Status = "idle" | "processing" | "success" | "failed";

export interface AbstractActionState<S extends Status> {
  status: S;
}

export type ActionFailureReason = "timeout" | "aborted" | "error";

export interface AbstractFailedAction<R extends ActionFailureReason>
  extends AbstractActionState<"failed"> {
  reason: R;
}

export interface ActionFailedByError<E> extends AbstractFailedAction<"error"> {
  error: E;
}

export type FailedAction<E> =
  | ActionFailedByError<E>
  | AbstractFailedAction<"timeout">
  | AbstractFailedAction<"aborted">;

export interface ProcessingAction<T, R>
  extends AbstractActionState<"processing"> {
  delayed: boolean;
  args: T;
  promise: Promise<R>;
  abortController: AbortController;
}

export type ActionState<T, R, E> =
  | AbstractActionState<"idle">
  | ProcessingAction<T, R>
  | AbstractActionState<"success">
  | FailedAction<E>;

export type ActionsCombinatorDecision = boolean | "abort" | "untrack";

export type ActionsCombinator<T, R, E> = (
  state: ActionState<T, R, E>
) => ActionsCombinatorDecision;

export interface ActionOptions<T extends ReadonlyArray<any>, R, E> {
  execute: (signal: AbortSignal, ...args: T) => Promise<R>;
  onSuccess?: (result: R, ...args: T) => void;
  onFailure?: (failure: FailedAction<E>, ...args: T) => void;
  /**
   * The `combinator` runtime error is interpreted as `false`.
   * @default waitPrevious
   */
  combinator?: ActionsCombinator<T, R, E>;
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
 * Forget previous action
 */
export const forgetPrevious: ActionsCombinator<any, any, any> = () => true;

/**
 * Abort previous action
 */
export const abortPrevious: ActionsCombinator<any, any, any> = () => "abort";

/**
 * Ignore new action until the previous action is completed
 */
export const waitPrevious: ActionsCombinator<any, any, any> = ({ status }) =>
  status !== "processing";

export function throttle<T, R, E>(
  combinator: ActionsCombinator<T, R, E>,
  delayedMs: number
): ActionsCombinator<T, R, E> {
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
  constructor(public readonly state: ActionState<T, R, E>) {}
}
export class CompletionError<E> {
  constructor(public readonly state: FailedAction<E>) {}
}

/** @deprecated use `Task` from `lib/task.svelte` */
export interface Action<T extends ReadonlyArray<any>, R, E> {
  readonly state: Readonly<ActionState<T, R, E>>;
  readonly status: Status;
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isProcessed: boolean;
  readonly isDelayed: boolean;
  matches<S extends Status>(
    status: S
  ): this is Action<T, R, E> & {
    status: S;
    state: Readonly<Extract<ActionState<T, R, E>, AbstractActionState<S>>>;
  };
  /**
   * Initiates the action without waiting for its result.
   * Any side effects or failures are handled internally.
   */
  run(...args: T): void;

  /**
   * Initiates the action and returns a promise that resolves when the action completes.
   * Use this method when you need to handle the result or catch errors.
   * @throws InitializationError if combinator returns `false`.
   * @throws CompletionError if action were aborted or timeouted.
   */
  runAsync(...args: T): Promise<R>;

  /**
   * Aborts the ongoing action if it is currently processing.
   * The action will fail with an "aborted" reason and trigger any associated failure callbacks.
   */
  abort(): void;
}

/** @deprecated use `createTask` from `lib/task.svelte` */
export function createAction<
  T extends ReadonlyArray<any>,
  R = unknown,
  E = unknown,
>(options: ActionOptions<T, R, E>): Action<T, R, E> {
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

  let state = $state.raw<ActionState<T, R, E>>({
    status: "idle",
  });
  let delayedCallbackId: NodeJS.Timeout;
  let timeoutCallbackId: NodeJS.Timeout;

  function clearTimeouts() {
    clearTimeout(delayedCallbackId);
    clearTimeout(timeoutCallbackId);
  }

  function abort(state: ProcessingAction<T, R>) {
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

  function initAbortController(decision: ActionsCombinatorDecision) {
    if (state.status === "processing") {
      if (decision !== "abort") {
        return state.abortController;
      }
      abort(state);
    }
    return new AbortController();
  }

  async function run(decision: ActionsCombinatorDecision, args: T): Promise<R> {
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
      delayed: action.isDelayed,
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

  const action: Action<T, R, E> = {
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
    ): this is Action<T, R, E> & {
      status: S;
      state: Readonly<Extract<ActionState<T, R, E>, AbstractActionState<S>>>;
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
  return action;
}

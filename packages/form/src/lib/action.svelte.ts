import { DEV } from "esm-env";

import { noop } from "./function.js";
import type { MaybePromise } from "./types.js";

export enum Status {
  IDLE,
  Processed,
  Success,
  Failed,
}

export interface AbstractActionState<S extends Status> {
  status: S;
}

export type ActionFailureReason = "timeout" | "aborted" | "error";

export interface AbstractFailedAction<R extends ActionFailureReason>
  extends AbstractActionState<Status.Failed> {
  reason: R;
}

export interface ActionFailedByError<E> extends AbstractFailedAction<"error"> {
  error: E;
}

export type FailedAction<E> =
  | ActionFailedByError<E>
  | AbstractFailedAction<"timeout">
  | AbstractFailedAction<"aborted">;

export interface ProcessedAction<T, R>
  extends AbstractActionState<Status.Processed> {
  delayed: boolean;
  args: T;
  promise: Promise<R>;
}

export type ActionState<T, R, E> =
  | AbstractActionState<Status.IDLE>
  | ProcessedAction<T, R>
  | AbstractActionState<Status.Success>
  | FailedAction<E>;

export type ActionsCombinator<T, R, E> = (
  state: ActionState<T, R, E>
) => MaybePromise<boolean | "abort">;

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
  status !== Status.Processed;

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

export function debounce<T, R, E>(
  combinator: ActionsCombinator<T, R, E>,
  delayedMs: number
): ActionsCombinator<T, R, E> {
  let callbackId: NodeJS.Timeout;
  let lastReject: undefined | (() => void);
  return (state) => {
    clearTimeout(callbackId);
    lastReject?.();
    return new Promise((resolve, reject) => {
      lastReject = reject;
      callbackId = setTimeout(() => {
        lastReject = undefined;
        resolve(combinator(state));
      }, delayedMs);
    });
  };
}

export class InitializationError<T, R, E> {
  constructor(public readonly state: ActionState<T, R, E>) {}
}
export class CompletionError<E> {
  constructor(public readonly state: FailedAction<E>) {}
}

export interface Action<T extends ReadonlyArray<any>, R, E> {
  readonly state: Readonly<ActionState<T, R, E>>;
  readonly status: Status;
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isProcessed: boolean;
  readonly isDelayed: boolean;
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
    status: Status.IDLE,
  });
  let abortController: AbortController | null = null;
  let delayedCallbackId: NodeJS.Timeout;
  let timeoutCallbackId: NodeJS.Timeout;

  function clearTimeouts() {
    clearTimeout(delayedCallbackId);
    clearTimeout(timeoutCallbackId);
  }

  function abort() {
    abortController?.abort();
    abortController = null;
    clearTimeouts();
  }

  function runEffect(promise: Promise<R>, effect: () => void) {
    if (state.status === Status.Failed) {
      throw new CompletionError(state);
    }
    if (state.status === Status.Processed && state.promise === promise) {
      clearTimeouts();
      effect();
    }
  }

  async function runAsync(args: T): Promise<R> {
    let decision: boolean | "abort";
    try {
      const dec = combinator(state);
      if (dec instanceof Promise) {
        decision = await dec;
      } else {
        decision = dec;
      }
    } catch (error) {
      decision = false;
    }
    if (decision === false) {
      throw new InitializationError(state);
    }
    if (decision === "abort") {
      abort();
    }
    abortController = new AbortController();
    const promise = options.execute(abortController.signal, ...args).then(
      (result) => {
        runEffect(promise, () => {
          state = { status: Status.Success };
          options.onSuccess?.(result, ...args);
        });
        return result;
      },
      (error) => {
        runEffect(promise, () => {
          state = { status: Status.Failed, reason: "error", error };
          options.onFailure?.(state, ...args);
        });
        return Promise.reject(error);
      }
    );
    state = {
      status: Status.Processed,
      delayed: action.isDelayed,
      args,
      promise,
    };
    clearTimeouts();
    delayedCallbackId = setTimeout(() => {
      if (state.status !== Status.Processed || state.promise !== promise)
        return;
      state = { status: Status.Processed, delayed: true, args, promise };
    }, delayedMs);
    timeoutCallbackId = setTimeout(() => {
      if (state.status !== Status.Processed || state.promise !== promise)
        return;
      state = { status: Status.Failed, reason: "timeout" };
      abort();
      options.onFailure?.(state, ...args);
    }, timeoutMs);
    return promise;
  }

  const action: Action<T, R, E> = {
    get state() {
      return state;
    },
    get status() {
      return state.status;
    },
    get isSuccess() {
      return state.status === Status.Success;
    },
    get isFailed() {
      return state.status === Status.Failed;
    },
    get isProcessed() {
      return state.status === Status.Processed;
    },
    get isDelayed() {
      return state.status === Status.Processed && state.delayed;
    },
    run(...args) {
      void runAsync(args).catch(noop);
    },
    runAsync(...args) {
      return runAsync(args);
    },
    abort() {
      if (state.status !== Status.Processed) return;
      const { args } = state;
      state = { status: Status.Failed, reason: "aborted" };
      abort();
      options.onFailure?.(state, ...args);
    },
  };
  return action;
}

// Order is important
export enum Status {
  Failed,
  Success,
  IDLE,
  Processed,
  Delayed,
}

export interface AbstractActionsState<S extends Status> {
  status: S;
}

export type ActionFailureReason = "timeout" | "aborted" | "error";

export interface AbstractFailedAction<R extends ActionFailureReason>
  extends AbstractActionsState<Status.Failed> {
  reason: R;
}

export interface ActionFailedByError<E> extends AbstractFailedAction<"error"> {
  error: E;
}

export type FailedAction<E> =
  | ActionFailedByError<E>
  | AbstractFailedAction<Exclude<ActionFailureReason, "error">>;

export type ActionState<E> =
  | FailedAction<E>
  | AbstractActionsState<Exclude<Status, Status.Failed>>;

export type ActionsCombinator<E> = (state: ActionState<E>) => boolean | "abort";

export interface ActionOptions<T, R, E = unknown> {
  do: (signal: AbortSignal, data: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  onFailure?: (failure: FailedAction<E>) => void;
  /**
   * @default waitForPrevious
   */
  combinator?: ActionsCombinator<E>;
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
 * Wait for completion of previous action
 */
export const waitForPrevious: ActionsCombinator<any> = ({ status }) =>
  status <= Status.IDLE;

/**
 * Abort previous action
 */
export const abortPrevious: ActionsCombinator<any> = () => "abort";

/**
 * Ignore previous action
 */
export const ignorePrevious: ActionsCombinator<any> = () => true;

export interface Action<T, R, E = unknown> {
  readonly state: Readonly<ActionState<E>>;
  readonly status: Status;
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isProcessed: boolean;
  readonly isDelayed: boolean;
  run(value: T): void;
  abort(): void;
}

export function useAction<T, R, E = unknown>(
  options: ActionOptions<T, R, E>
): Action<T, R, E> {
  const delayedMs = $derived(options.delayedMs ?? 500);
  const timeoutMs = $derived(options.timeoutMs ?? 8000);
  const combinator = $derived(options.combinator ?? waitForPrevious);

  let state = $state<ActionState<E>>({
    status: Status.IDLE,
  });
  let abortController: AbortController | null = null;
  let ref: WeakRef<Promise<void>> | null = null;
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

  const status = $derived(state.status);
  const isSuccess = $derived(status === Status.Success);
  const isFailed = $derived(status === Status.Failed);
  const isProcessed = $derived(status === Status.Processed);
  const isDelayed = $derived(status === Status.Delayed);

  return {
    get state() {
      return state;
    },
    get status() {
      return status;
    },
    get isSuccess() {
      return isSuccess;
    },
    get isFailed() {
      return isFailed;
    },
    get isProcessed() {
      return isProcessed;
    },
    get isDelayed() {
      return isDelayed;
    },
    run(value: T) {
      const decision = combinator(state);
      if (decision === false) return;
      if (decision === "abort") {
        abort();
      }
      state = {
        status: status === Status.Delayed ? Status.Processed : Status.IDLE,
      };
      abortController = new AbortController();
      const action = options.do(abortController.signal, value).then(
        (result) => {
          if (ref?.deref() !== action) return;
          state = { status: Status.Success };
          options.onSuccess?.(result);
        },
        (error) => {
          // Action may have been aborted by user or timeout
          if (ref?.deref() !== action || status === Status.Failed) return;
          state = { status: Status.Failed, reason: "error", error };
          options.onFailure?.(state);
        }
      );
      ref = new WeakRef(action);
      clearTimeouts();
      delayedCallbackId = setTimeout(() => {
        if (ref?.deref() !== action) return;
        state = { status: Status.Delayed };
      }, delayedMs);
      timeoutCallbackId = setTimeout(() => {
        if (ref?.deref() !== action) return;
        state = { status: Status.Failed, reason: "timeout" };
        abort();
        options.onFailure?.(state);
      }, timeoutMs);
    },
    abort() {
      state = { status: Status.Failed, reason: "aborted" };
      abort();
      options.onFailure?.(state);
    },
  };
}

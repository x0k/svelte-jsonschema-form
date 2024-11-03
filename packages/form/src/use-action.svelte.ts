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

export interface ActionOptions<T, R, E> {
  do: (signal: AbortSignal, data: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  onFailure?: (failure: FailedAction<E>) => void;
  /**
   * @default ignoreNewUntilPreviousIsFinished
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
 * Forget previous action
 */
export const forgetPrevious: ActionsCombinator<any> = () => true;

/**
 * Abort previous action
 */
export const abortPrevious: ActionsCombinator<any> = () => "abort";

/**
 * Ignore new actions until the previous action is completed
 */
export const ignoreNewUntilPreviousIsFinished: ActionsCombinator<any> = ({
  status,
}) => status <= Status.IDLE;

export interface Action<T, R, E> {
  readonly state: Readonly<ActionState<E>>;
  readonly status: Status;
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isProcessed: boolean;
  readonly isDelayed: boolean;
  run(data: T): Promise<void>;
  abort(): void;
}

export function useAction<T, R = unknown, E = unknown>(
  options: ActionOptions<T, R, E>
): Action<T, R, E> {
  const delayedMs = $derived(options.delayedMs ?? 500);
  const timeoutMs = $derived(options.timeoutMs ?? 8000);
  const combinator = $derived(
    options.combinator ?? ignoreNewUntilPreviousIsFinished
  );

  let state = $state.raw<ActionState<E>>({
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

  const isSuccess = $derived(state.status === Status.Success);
  const isFailed = $derived(state.status === Status.Failed);
  const isProcessed = $derived(state.status === Status.Processed);
  const isDelayed = $derived(state.status === Status.Delayed);

  return {
    get state() {
      return state;
    },
    get status() {
      return state.status;
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
    run(data) {
      const decision = combinator(state);
      if (decision === false) {
        return Promise.resolve();
      }
      if (decision === "abort") {
        abort();
      }
      state = {
        status:
          state.status === Status.Delayed ? Status.Delayed : Status.Processed,
      };
      abortController = new AbortController();
      const action = options.do(abortController.signal, data).then(
        (result) => {
          if (ref?.deref() !== action || state.status === Status.Failed) return;
          state = { status: Status.Success };
          options.onSuccess?.(result);
        },
        (error) => {
          // Action may have been aborted by user or timeout
          if (ref?.deref() !== action || state.status === Status.Failed) return;
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
      return action;
    },
    abort() {
      state = { status: Status.Failed, reason: "aborted" };
      abort();
      options.onFailure?.(state);
    },
  };
}

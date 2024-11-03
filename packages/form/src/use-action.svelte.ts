export enum Status {
  IDLE,
  Processed,
  Success,
  Failed,
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

export interface ProcessedAction
  extends AbstractActionsState<Status.Processed> {
  delayed: boolean;
}

export type ActionState<E> =
  | FailedAction<E>
  | ProcessedAction
  | AbstractActionsState<Exclude<Status, Status.Failed | Status.Processed>>;

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
}) => status !== Status.Processed;

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
  if (timeoutMs < delayedMs) {
    throw new Error("timeoutMs must be greater than delayedMs");
  }
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
    run(data) {
      const decision = combinator(state);
      if (decision === false) {
        return Promise.resolve();
      }
      if (decision === "abort") {
        abort();
      }
      state = {
        status: Status.Processed,
        delayed: action.isDelayed,
      };
      abortController = new AbortController();
      const promise = options.do(abortController.signal, data).then(
        (result) => {
          // Action may have been aborted by user or timeout
          if (ref?.deref() !== promise || state.status === Status.Failed)
            return;
          state = { status: Status.Success };
          clearTimeouts();
          options.onSuccess?.(result);
        },
        (error) => {
          if (ref?.deref() !== promise || state.status === Status.Failed)
            return;
          state = { status: Status.Failed, reason: "error", error };
          clearTimeouts();
          options.onFailure?.(state);
        }
      );
      ref = new WeakRef(promise);
      clearTimeouts();
      delayedCallbackId = setTimeout(() => {
        if (ref?.deref() !== promise || state.status !== Status.Processed)
          return;
        state = { status: Status.Processed, delayed: true };
      }, delayedMs);
      timeoutCallbackId = setTimeout(() => {
        if (ref?.deref() !== promise || state.status !== Status.Processed)
          return;
        state = { status: Status.Failed, reason: "timeout" };
        abort();
        options.onFailure?.(state);
      }, timeoutMs);
      return promise;
    },
    abort() {
      state = { status: Status.Failed, reason: "aborted" };
      abort();
      options.onFailure?.(state);
    },
  };
  return action;
}

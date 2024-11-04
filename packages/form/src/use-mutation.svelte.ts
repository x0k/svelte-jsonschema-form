export enum Status {
  IDLE,
  Processed,
  Success,
  Failed,
}

export interface AbstractMutationState<S extends Status> {
  status: S;
}

export type MutationFailureReason = "timeout" | "aborted" | "error";

export interface AbstractFailedMutation<R extends MutationFailureReason>
  extends AbstractMutationState<Status.Failed> {
  reason: R;
}

export interface MutationFailedByError<E> extends AbstractFailedMutation<"error"> {
  error: E;
}

export type FailedMutation<E> =
  | MutationFailedByError<E>
  | AbstractFailedMutation<Exclude<MutationFailureReason, "error">>;

export interface ProcessedMutation
  extends AbstractMutationState<Status.Processed> {
  delayed: boolean;
}

export type MutationState<E> =
  | FailedMutation<E>
  | ProcessedMutation
  | AbstractMutationState<Exclude<Status, Status.Failed | Status.Processed>>;

export type MutationsCombinator<E> = (state: MutationState<E>) => boolean | "abort";

export interface MutationOptions<T extends ReadonlyArray<any>, R, E> {
  mutate: (signal: AbortSignal, ...args: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  onFailure?: (failure: FailedMutation<E>) => void;
  /**
   * @default ignoreNewUntilPreviousIsFinished
   */
  combinator?: MutationsCombinator<E>;
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
 * Forget previous mutation
 */
export const forgetPrevious: MutationsCombinator<any> = () => true;

/**
 * Abort previous mutation
 */
export const abortPrevious: MutationsCombinator<any> = () => "abort";

/**
 * Ignore new mutation until the previous mutation is completed
 */
export const ignoreNewUntilPreviousIsFinished: MutationsCombinator<any> = ({
  status,
}) => status !== Status.Processed;

export interface Mutation<T extends ReadonlyArray<any>, R, E> {
  readonly state: Readonly<MutationState<E>>;
  readonly status: Status;
  readonly isSuccess: boolean;
  readonly isFailed: boolean;
  readonly isProcessed: boolean;
  readonly isDelayed: boolean;
  run(...args: T): Promise<void>;
  abort(): void;
}

export function useMutation<T extends ReadonlyArray<any>, R = unknown, E = unknown>(
  options: MutationOptions<T, R, E>
): Mutation<T, R, E> {
  const delayedMs = $derived(options.delayedMs ?? 500);
  const timeoutMs = $derived(options.timeoutMs ?? 8000);
  if (timeoutMs < delayedMs) {
    throw new Error("timeoutMs must be greater than delayedMs");
  }
  const combinator = $derived(
    options.combinator ?? ignoreNewUntilPreviousIsFinished
  );

  let state = $state.raw<MutationState<E>>({
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

  const mutation: Mutation<T, R, E> = {
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
      const decision = combinator(state);
      if (decision === false) {
        return Promise.resolve();
      }
      if (decision === "abort") {
        abort();
      }
      state = {
        status: Status.Processed,
        delayed: mutation.isDelayed,
      };
      abortController = new AbortController();
      const promise = options.mutate(abortController.signal, ...args).then(
        (result) => {
          // Mutation may have been aborted by user or timeout
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
  return mutation;
}

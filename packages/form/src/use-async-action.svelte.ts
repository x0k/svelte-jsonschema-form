interface AsyncActionOptions<T> {
  action: (signal: AbortSignal, data: T) => Promise<void>;
  delayedMs?: number;
  timeoutMs?: number;
}

enum Status {
  IDLE,
  Processing,
  Delayed,
  Timeout,
}

export function useAsyncAction<T>({
  action,
  delayedMs = 500,
  timeoutMs = 8000,
}: AsyncActionOptions<T>) {
  let isProcessing = $state(false);
  let isDelayed = $state(false);
  let isTimeout = $state(false);

  function setStatus(status: Status) {
    isProcessing = status >= Status.Processing;
    isDelayed = status >= Status.Delayed;
    isTimeout = status >= Status.Timeout;
  }

  let delayedCallbackId: number;
  let timeoutCallbackId: number;

  function startTimeouts() {
    clearTimeout(delayedCallbackId);
    clearTimeout(timeoutCallbackId);
  }

  function run (value: T) {
    setStatus(Status.Processing);

  }

  return {
    get isProcessing() {
      return isProcessing;
    },
    get isDelayed() {
      return isDelayed;
    },
    get isTimeout() {
      return isTimeout;
    },
  };
}

import { tick, untrack } from "svelte";

export interface SyncInput<V> {
  /**
   * @param isDependencyRegistrationOnlyCall - when `true`, indicates that function is called only for dependency registration and result will be ignored
   */
  (isDependencyRegistrationOnlyCall: false): V;
  (isDependencyRegistrationOnlyCall: true): void;
}

export function proxy<V>(input: SyncInput<V>) {
  let ignoreInputUpdate = false;
  let proxyValue = $state.raw<V>();
  const output = $derived.by(() => {
    const proxyVal = proxyValue;
    if (ignoreInputUpdate) {
      ignoreInputUpdate = false;
      input(true);
      return proxyVal as V;
    }
    return input(false);
  });
  return {
    get value() {
      return output;
    },
    set value(value: V) {
      if (Object.is(proxyValue, value)) {
        return;
      }
      ignoreInputUpdate = true;
      proxyValue = value;
    },
  };
}

export interface AsyncInput<V> {
  /**
   * @param isDependencyRegistrationOnlyCall - when `true`, indicates that function is called only for dependency registration and result will be ignored
   */
  (isDependencyRegistrationOnlyCall: false, signal: AbortSignal): Promise<V>;
  /**
   * @param signal used here to simplify typing
   */
  (isDependencyRegistrationOnlyCall: true, signal: AbortSignal): void;
}

export function asyncProxy<V>(
  asyncInput: AsyncInput<V>,
  asyncOutput: (value: V, signal: AbortSignal) => Promise<void>,
  defaultValue: (prev: V | undefined) => V
) {
  let inputsInProcess = $state.raw(0);
  let outputsInProcess = $state.raw(0);
  let proxyValue = $state.raw<V>();
  let inputController = new AbortController();
  let outputController = new AbortController();
  let ignoreProxyUpdate = true;
  const derivation = $derived.by(() => {
    const proxyVal = proxyValue;
    if (ignoreProxyUpdate) {
      ignoreProxyUpdate = false;
      asyncInput(true, inputController.signal);
      return proxyVal as V;
    }
    inputController.abort();
    inputController = new AbortController();
    outputController.abort();
    outputController = new AbortController();
    untrack(() => {
      inputsInProcess++;
    });
    asyncInput(false, inputController.signal)
      .then((v) => {
        ignoreProxyUpdate = true;
        proxyValue = v;
      })
      .finally(() => {
        untrack(() => {
          inputsInProcess--;
        });
      });
    return defaultValue(proxyVal);
  });
  return {
    get value() {
      return derivation;
    },
    set value(v) {
      if (Object.is(proxyValue, v)) {
        return;
      }
      outputController.abort();
      outputController = new AbortController();
      outputsInProcess++;
      asyncOutput(v, outputController.signal)
        .then(() => {
          ignoreProxyUpdate = true;
        })
        .finally(() => {
          outputsInProcess--;
        });
    },
    get inputProcessing() {
      return inputsInProcess > 0;
    },
    get outputProcessing() {
      return outputsInProcess > 0;
    },
  };
}

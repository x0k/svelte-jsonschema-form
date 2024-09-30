import { tick } from "svelte";

export interface ProxyConfig<V> {
  guard?: (v: V) => boolean;
  /**
   * @returns `true` to indicate that input update should not be ignored
   */
  update?: (v: V) => void | boolean;
}

export interface SyncInput<V> {
  /**
   * @param isDependencyRegistrationOnlyCall - when `true`, indicates that function is called only for dependency registration and result will be ignored
   */
  (isDependencyRegistrationOnlyCall: false): V;
  (isDependencyRegistrationOnlyCall: true): void;
}

export function proxy<V>(input: SyncInput<V>, config: ProxyConfig<V> = {}) {
  let ignoreInputUpdate = false;
  let lastOutputValue = $state.raw<V>();
  const output = $derived.by(() => {
    const trackedLastOutputValue = lastOutputValue;
    if (ignoreInputUpdate) {
      ignoreInputUpdate = false;
      input(true);
      return trackedLastOutputValue as V;
    }
    return input(false);
  });
  return {
    get value() {
      return output;
    },
    set value(value: V) {
      if (config.guard && !config.guard(value)) {
        return;
      }
      // NOTE: We should not to ignore input update in two cases:
      // 1. During input update new value is produced (`true` value returned from `config.update`)
      // 2. Setter is executed with the same value as last one (because `output` will not be
      //    triggered and `ignoreInputUpdate` flag will be stale)
      ignoreInputUpdate =
        !config.update?.(value) && !Object.is(value, lastOutputValue);
      lastOutputValue = value;
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
  defaultValue: (prev: V | undefined) => V,
  config: ProxyConfig<V> = {}
) {
  let ignoreInputUpdate = false;
  let processing = $state.raw(false);
  let lastOutputValue = $state.raw<V>();
  let controller = new AbortController();
  const output = $derived.by(() => {
    controller.abort();
    controller = new AbortController();
    const trackedLastOutputValue = lastOutputValue;
    if (ignoreInputUpdate) {
      ignoreInputUpdate = false;
      asyncInput(true, controller.signal);
      return trackedLastOutputValue as V;
    }
    tick()
      .then(() => {
        processing = true;
        return asyncInput(false, controller.signal);
      })
      .then(
        (v) => {
          ignoreInputUpdate = true;
          lastOutputValue = v;
          processing = false;
        },
        (e) => {
          if (e instanceof DOMException && e.name === "AbortError") {
            // NOTE: Do not reset `processing` flag here, because
            // another update is already in progress
            return;
          }
          processing = false;
          console.error(
            "An error occurred while calculating the proxy value",
            e
          );
          console.warn(
            "You should handle all errors except abort error on your side"
          );
        }
      );
    return defaultValue(trackedLastOutputValue);
  });
  return {
    get processing() {
      return processing;
    },
    get value() {
      return output;
    },
    set value(value: V) {
      if (config.guard && !config.guard(value)) {
        return;
      }
      // NOTE: We should not to ignore input update in two cases:
      // 1. During input update new value is produced (`true` value returned from `config.update`)
      // 2. Setter is executed with the same value as last one (because `output` will not be
      //    triggered and `ignoreInputUpdate` flag will be stale)
      ignoreInputUpdate =
        !config.update?.(value) && !Object.is(value, lastOutputValue);
      lastOutputValue = value;
    },
  };
}

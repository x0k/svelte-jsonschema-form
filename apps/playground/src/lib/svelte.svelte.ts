export type TransformationConfig<V> = {
  /**
   * @param isDependencyRegistrationOnlyCall - when `true`, indicates that function is called only for dependency registration and result will be ignored
   */
  transform: (isDependencyRegistrationOnlyCall: boolean) => V;
  guard?: (v: V) => boolean;
  /**
   * @returns `true` to indicate that input update should not be ignored
   */
  update?: (v: V) => (void | boolean);
};

export function createTransformation<V>(config: TransformationConfig<V>) {
  let ignoreInputUpdate = false;
  let lastOutputValue = $state.raw<V>();
  const output = $derived.by(() => {
    const trackedLastOutputValue = lastOutputValue;
    if (ignoreInputUpdate) {
      ignoreInputUpdate = false;
      config.transform(true);
      return trackedLastOutputValue as V;
    }
    return config.transform(false);
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
      // 2. Setter is executed with same value as last one (because `derivedOutput` will not be
      //    triggered and `ignoreInputUpdate` flag will be stale)
      ignoreInputUpdate = !config.update?.(value) && !Object.is(value, lastOutputValue);
      lastOutputValue = value;
    },
  };
}

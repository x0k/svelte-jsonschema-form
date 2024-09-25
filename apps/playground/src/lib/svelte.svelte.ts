export type TransformationConfig<V> = {
  /**
   * @param isDependencyRegistrationOnlyCall - when `true`, indicates that function is called only for dependency registration and result will be ignored
   */
  transform: (isDependencyRegistrationOnlyCall: boolean) => V;
  guard?: (v: V) => boolean;
  update?: (v: V) => void;
};

export function createTransformation<V>(config: TransformationConfig<V>) {
  let updatedBySuccessor = false;
  let updatedValue = $state.raw<V>();
  const transformed = $derived.by(() => {
    const updated = updatedValue;
    if (updatedBySuccessor) {
      updatedBySuccessor = false;
      config.transform(true);
      return updated as V;
    }
    return config.transform(false);
  });
  return {
    get value() {
      return transformed;
    },
    set value(value: V) {
      if (config.guard && !config.guard(value)) {
        return;
      }
      updatedBySuccessor = !Object.is(value, updatedValue);
      updatedValue = value;
      config.update?.(value);
    },
  };
}

export type TransformationConfig<I, O> = {
  input: () => I;
  transform: (v: I) => O;
  guard?: (v: O) => boolean;
  update?: (v: O) => void;
};

export function createTransformation<I, O>(config: TransformationConfig<I, O>) {
  let updatedBySuccessor = false;
  let updatedValue = $state.raw<O>();
  const transformed = $derived.by(() => {
    const value = config.input();
    const updated = updatedValue;
    if (updatedBySuccessor) {
      updatedBySuccessor = false;
      return updated as O;
    }
    return config.transform(value);
  });
  return {
    get value() {
      return transformed;
    },
    set value(value: O) {
      if (config.guard && !config.guard(value)) {
        return;
      }
      updatedBySuccessor = !Object.is(value, updatedValue);
      updatedValue = value;
      config.update?.(value);
    },
  };
}

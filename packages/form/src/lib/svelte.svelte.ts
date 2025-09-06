import { abortPrevious, createTask } from "./task.svelte.js";

export interface Ref<T> {
  current: T;
}

export type Lens<T> = [get: () => T, set: (v: T) => void];

export function refFromLens<T>([get, set]: Lens<T>): Ref<T> {
  return {
    get current() {
      return get();
    },
    set current(v) {
      set(v);
    },
  };
}

export interface AsyncBindingOptions<I, O> {
  initialOutput: O;
  toOutput: (signal: AbortSignal, input: I) => Promise<O>;
  toInput: (signal: AbortSignal, output: O) => Promise<I>;
  setInput: (v: I) => void;
  getInput: () => I;
  isEqual?: (a: I, b: I | undefined) => boolean;
}

export function createAsyncBinding<I, O>({
  initialOutput,
  getInput,
  setInput,
  toInput,
  toOutput,
  isEqual = Object.is,
}: AsyncBindingOptions<I, O>) {
  let lastInputUpdate: I | undefined;
  const toInputTask = createTask({
    combinator: abortPrevious,
    execute: toInput,
    onSuccess(result: I) {
      lastInputUpdate = result;
      setInput(result);
    },
  });

  let output = $state.raw(initialOutput);
  const toOutputTask = createTask({
    combinator: abortPrevious,
    execute: toOutput,
    onSuccess(result: O) {
      output = result;
    },
  });

  $effect(() => {
    const input = getInput();
    if (isEqual(input, lastInputUpdate)) {
      return;
    }
    toInputTask.abort();
    toOutputTask.run(input);
  });

  return {
    get current() {
      return output;
    },
    set current(v) {
      toOutputTask.abort();
      toInputTask.run(v);
    },
    get inputProcessing() {
      return toInputTask.isProcessed;
    },
    get outputProcessing() {
      return toOutputTask.isProcessed;
    },
  };
}

import { untrack } from "svelte";

import { abortPrevious, createAction } from "./action.svelte.js";

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
  const toInputAction = createAction({
    combinator: abortPrevious,
    execute: toInput,
    onSuccess(result: I) {
      lastInputUpdate = result;
      setInput(result);
    },
  });

  let output = $state.raw(initialOutput);
  const toOutputAction = createAction({
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
    untrack(() => {
      toInputAction.abort();
      toOutputAction.run(input);
    });
  });

  return {
    get current() {
      return output;
    },
    set current(v) {
      toOutputAction.abort();
      toInputAction.run(v);
    },
    get inputProcessing() {
      return toInputAction.isProcessed;
    },
    get outputProcessing() {
      return toOutputAction.isProcessed;
    },
  };
}

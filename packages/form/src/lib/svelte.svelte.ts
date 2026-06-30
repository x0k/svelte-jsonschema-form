import { isRecordProto } from "./object.js";
import { abortPrevious, createTask } from "./task.svelte.js";

export interface Ref<T> {
  current: T;
}

export type Bind<T> = [get: () => T, set: (v: T) => void];

export function refFromBind<T>([get, set]: Bind<T>): Ref<T> {
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
      output = v;
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

/**
 * Like `$state.snapshot`, but preserves Symbol properties.
 * Svelte's internal `clone.js` uses `Object.keys()` which strips symbols.
 */
export function snapshotWithSymbols<T>(value: T): T {
  return cloneWithSymbols(value, new Map());
}

function cloneWithSymbols<T>(value: T, seen: Map<unknown, unknown>): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const cached = seen.get(value);
  if (cached !== undefined) {
    return cached as T;
  }

  if (Array.isArray(value)) {
    const arr = new Array(value.length);
    seen.set(value, arr);
    for (let i = 0; i < value.length; i++) {
      if (i in value) {
        arr[i] = cloneWithSymbols(value[i], seen);
      }
    }
    return arr as T;
  }

  if (isRecordProto(value)) {
    const obj: Record<PropertyKey, unknown> = {};
    seen.set(value, obj);
    for (const key of Reflect.ownKeys(value)) {
      obj[key] = cloneWithSymbols(value[key], seen);
    }
    return obj as T;
  }

  return value;
}

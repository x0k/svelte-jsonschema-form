import { getContext, setContext } from "svelte";

import { createKeyedArray } from "@/lib/keyed-array.svelte.js";
import type { Schema, SchemaArrayValue, Validator } from "@/core/index.js";
import {
  AFTER_SUBMITTED,
  getDefaultFieldState,
  getErrors,
  getUiOptions,
  ON_ARRAY_CHANGE,
  validateField,
  type Config,
  type FieldError,
  type FormInternalContext,
  type PossibleError,
} from "@/form/index.js";

export interface ArrayContext<V extends Validator> {
  canAdd: boolean;
  addable: boolean;
  orderable: boolean;
  removable: boolean;
  copyable: boolean;
  errors: FieldError<PossibleError<V>>[];
  key(index: number): number;
  pushItem(itemSchema: Schema): void;
  moveItemUp(index: number): void;
  moveItemDown(index: number): void;
  copyItem(index: number): void;
  removeItem(index: number): void;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext<V extends Validator>(): ArrayContext<V> {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext<V extends Validator>(ctx: ArrayContext<V>) {
  setContext(ARRAY_CONTEXT, ctx);
}

export function createArrayContext<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: () => Config,
  value: () => SchemaArrayValue | undefined
): ArrayContext<V> {
  const uiOptions = $derived(getUiOptions(ctx, config().uiSchema));
  const {
    addable = true,
    orderable = true,
    removable = true,
    copyable = false,
  } = $derived(uiOptions ?? {});

  let val, maxItems;
  const canAdd = $derived(
    addable &&
      ((val = value()), Array.isArray(val)) &&
      ((maxItems = config().schema.maxItems),
      maxItems === undefined || val.length < maxItems)
  );
  const errors = $derived(getErrors(ctx, config().id));

  function validate() {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_ARRAY_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config(), value());
  }

  const keyedArray = createKeyedArray(() => value() ?? []);

  // NOTE: Defining this component as a generic will break packaging
  // dependant packages
  return {
    get errors() {
      return errors;
    },
    get canAdd() {
      return canAdd;
    },
    get addable() {
      return addable;
    },
    get orderable() {
      return orderable;
    },
    get removable() {
      return removable;
    },
    get copyable() {
      return copyable;
    },
    key(index) {
      return keyedArray.key(index);
    },
    pushItem(itemSchema: Schema) {
      keyedArray.push(getDefaultFieldState(ctx, itemSchema, undefined));
      validate();
    },
    moveItemUp(index) {
      keyedArray.swap(index, index - 1);
      validate();
    },
    moveItemDown(index) {
      keyedArray.swap(index, index + 1);
      validate();
    },
    copyItem(index) {
      keyedArray.insert(index, $state.snapshot(value()![index]));
      validate();
    },
    removeItem(index) {
      keyedArray.remove(index);
      validate();
    },
  };
}

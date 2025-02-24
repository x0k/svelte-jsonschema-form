import { getContext, setContext } from "svelte";

import type { Schema } from "@sjsf/form/core";

import type { FieldErrors, FormError, FormValidator } from "@sjsf/form";

export interface ArrayContext<E, V extends FormValidator<E>> {
  canAdd: boolean;
  addable: boolean;
  orderable: boolean;
  removable: boolean;
  copyable: boolean;
  errors: FieldErrors<FormError<E, V>>;
  key(index: number): number;
  pushItem(itemSchema: Schema): void;
  moveItemUp(index: number): void;
  moveItemDown(index: number): void;
  copyItem(index: number): void;
  removeItem(index: number): void;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext<E, V extends FormValidator<E>>(): ArrayContext<
  E,
  V
> {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext<E, V extends FormValidator<E>>(
  ctx: ArrayContext<E, V>
) {
  setContext(ARRAY_CONTEXT, ctx);
}

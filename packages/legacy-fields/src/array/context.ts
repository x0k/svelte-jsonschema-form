import { getContext, setContext } from "svelte";

import type { Schema } from "@sjsf/form/core";

import type { FieldErrors } from "@sjsf/form";

export interface ArrayContext<E> {
  canAdd: boolean;
  addable: boolean;
  orderable: boolean;
  removable: boolean;
  copyable: boolean;
  errors: FieldErrors<E>;
  key(index: number): number;
  pushItem(itemSchema: Schema): void;
  moveItemUp(index: number): void;
  moveItemDown(index: number): void;
  copyItem(index: number): void;
  removeItem(index: number): void;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext<E>(): ArrayContext<E> {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext<E>(ctx: ArrayContext<E>) {
  setContext(ARRAY_CONTEXT, ctx);
}

import { getContext, setContext } from "svelte";

import type { SchemaArrayValue } from "../../schema";
import type { Config } from '../../config';
import type { ValidationError } from '../../data-validator';

export interface ArrayContext {
  config: Config<SchemaArrayValue>;
  disabledOrReadonly: boolean;
  canAdd: boolean;
  addable: boolean;
  orderable: boolean;
  removable: boolean;
  copyable: boolean;
  errors: ValidationError<unknown>[];
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext(): ArrayContext {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext(ctx: ArrayContext) {
  setContext(ARRAY_CONTEXT, ctx);
}

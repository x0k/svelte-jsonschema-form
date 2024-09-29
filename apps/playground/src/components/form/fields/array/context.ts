import { getContext, setContext } from "svelte";

import type { SchemaArrayValue } from "../../schema";
import type { Config } from '../../config';

export interface ArrayContext {
  value: SchemaArrayValue | undefined;
  config: Config<SchemaArrayValue>;
  disabledOrReadonly: boolean;
  canAdd: boolean;
  addable: boolean;
  orderable: boolean;
  removable: boolean;
  copyable: boolean;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext(): ArrayContext {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext(ctx: ArrayContext) {
  setContext(ARRAY_CONTEXT, ctx);
}

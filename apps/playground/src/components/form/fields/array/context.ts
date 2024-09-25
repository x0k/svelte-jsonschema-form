import { getContext, setContext } from "svelte";

import type { Schema, SchemaArrayValue } from "../../schema";
import type { UiSchema } from "../../ui-schema";
import type { IdSchema } from "../../id-schema";

export interface ArrayContext {
  name: string;
  value: SchemaArrayValue | undefined;
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchema<SchemaArrayValue>;
  required: boolean;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext(): ArrayContext {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext(ctx: ArrayContext) {
  setContext(ARRAY_CONTEXT, ctx);
}

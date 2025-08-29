import {
  type Schema,
  type SchemaValue,
  isSelect as isSelectInternal,
  isFilesArray as isFilesArrayInternal,
  isMultiSelect as isMultiSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  sanitizeDataForNewSchema as sanitizeDataForNewSchemaInternal,
  getClosestMatchingOption as getClosestMatchingOptionInternal,
  type Validator,
} from "@/core/index.js";

import type { FormInternalContext } from "./context.js";

export function isSelect<V extends Validator>(
  ctx: FormInternalContext<V>,
  schema: Schema
) {
  return isSelectInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function isMultiSelect<V extends Validator>(
  ctx: FormInternalContext<V>,
  schema: Schema
) {
  return isMultiSelectInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function isFilesArray<V extends Validator>(
  ctx: FormInternalContext<V>,
  schema: Schema
) {
  return isFilesArrayInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function retrieveSchema<V extends Validator>(
  ctx: FormInternalContext<V>,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return retrieveSchemaInternal(
    ctx.validator,
    ctx.merger,
    schema,
    ctx.schema,
    formData
  );
}

export function sanitizeDataForNewSchema<V extends Validator>(
  ctx: FormInternalContext<V>,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaValue | undefined
) {
  return sanitizeDataForNewSchemaInternal(
    ctx.validator,
    ctx.merger,
    ctx.schema,
    newSchema,
    oldSchema,
    formData
  );
}

export function getClosestMatchingOption<V extends Validator>(
  ctx: FormInternalContext<V>,
  formData: SchemaValue | undefined,
  options: Schema[],
  selectedOption: number,
  discriminatorField: string | undefined
) {
  return getClosestMatchingOptionInternal(
    ctx.validator,
    ctx.merger,
    ctx.schema,
    formData,
    options,
    selectedOption,
    discriminatorField
  );
}

export function getDefaultFieldState<V extends Validator>(
  ctx: FormInternalContext<V>,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return ctx.merger.mergeFormDataAndSchemaDefaults(formData, schema);
}

export function markSchemaChange<V extends Validator>(
  ctx: FormInternalContext<V>
) {
  ctx.markSchemaChange();
}

import {
  type Schema,
  type SchemaValue,
  isSelect2 as isSelectInternal,
  isFilesArray as isFilesArrayInternal,
  isMultiSelect2 as isMultiSelectInternal,
  retrieveSchema2 as retrieveSchemaInternal,
  sanitizeDataForNewSchema2 as sanitizeDataForNewSchemaInternal,
  getClosestMatchingOption2 as getClosestMatchingOptionInternal,
} from "@/core/index.js";

import type { FormContext } from "./context.js";

export function isSelect(ctx: FormContext, schema: Schema) {
  return isSelectInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function isMultiSelect(ctx: FormContext, schema: Schema) {
  return isMultiSelectInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function isFilesArray(ctx: FormContext, schema: Schema) {
  return isFilesArrayInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function retrieveSchema(
  ctx: FormContext,
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

export function sanitizeDataForNewSchema(
  ctx: FormContext,
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

export function getClosestMatchingOption(
  ctx: FormContext,
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

export function getDefaultFieldState(
  ctx: FormContext,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return ctx.merger.mergeFormDataAndSchemaDefaults(formData, schema);
}

import {
  type Schema,
  type SchemaValue,
  isSelect as isSelectInternal,
  isMultiSelect as isMultiSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  sanitizeDataForNewSchema as sanitizeDataForNewSchemaInternal,
  getClosestMatchingOption as getClosestMatchingOptionInternal,
} from "@/core/index.js";

import { getDefaultFormState as getDefaultFormStateInternal } from "../get-default-form-state.js";

import type { FormContext } from "./context.js";

export function isSelect(ctx: FormContext, schema: Schema) {
  return isSelectInternal(ctx.validator, schema, ctx.schema);
}

export function isMultiSelect(ctx: FormContext, schema: Schema) {
  return isMultiSelectInternal(ctx.validator, schema, ctx.schema);
}

export function retrieveSchema(
  ctx: FormContext,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return retrieveSchemaInternal(ctx.validator, schema, ctx.schema, formData);
}

export function sanitizeDataForNewSchema(
  ctx: FormContext,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaValue | undefined
) {
  return sanitizeDataForNewSchemaInternal(
    ctx.validator,
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
    ctx.schema,
    formData,
    options,
    selectedOption,
    discriminatorField
  );
}

export function getDefaultFormState(
  ctx: FormContext,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return getDefaultFormStateInternal(
    ctx.validator,
    schema,
    formData,
    ctx.schema
  );
}

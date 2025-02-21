import {
  type Schema,
  type SchemaValue,
  isSelect as isSelectInternal,
  isFilesArray as isFilesArrayInternal,
  isMultiSelect as isMultiSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  sanitizeDataForNewSchema as sanitizeDataForNewSchemaInternal,
  getClosestMatchingOption as getClosestMatchingOptionInternal,
} from "@/core/index.js";

import type { FormValidator } from "../validator.js";

import type { FormContext } from "./context.js";

export function isSelect<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  schema: Schema
) {
  return isSelectInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function isMultiSelect<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  schema: Schema
) {
  return isMultiSelectInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function isFilesArray<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  schema: Schema
) {
  return isFilesArrayInternal(ctx.validator, ctx.merger, schema, ctx.schema);
}

export function retrieveSchema<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
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

export function sanitizeDataForNewSchema<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
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

export function getClosestMatchingOption<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
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

export function getDefaultFieldState<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return ctx.merger.mergeFormDataAndSchemaDefaults(formData, schema);
}

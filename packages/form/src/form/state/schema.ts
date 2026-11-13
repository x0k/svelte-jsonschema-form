import { getRenderedOptionSchema as getRenderedOptionSchemaInternal } from "#core/get-rendered-option-schema.js";
import {
  type Schema,
  type SchemaValue,
  isSelect as isSelectInternal,
  isFilesArray as isFilesArrayInternal,
  isMultiSelect as isMultiSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  sanitizeDataForNewSchema as sanitizeDataForNewSchemaInternal,
  getClosestMatchingOption as getClosestMatchingOptionInternal,
} from "#core/index.js";
import { CORE_MERGER } from "#core/internals.js";

import { FORM_MARK_SCHEMA_CHANGE } from "../internals.js";
import type { MergeFormDataAndSchemaDefaultsOptions } from "../merger.js";
import type { FormState } from "./state.js";

/**
 * @query
 */
export function isSelect<T>(ctx: FormState<T>, schema: Schema) {
  return isSelectInternal(ctx, schema);
}

/**
 * @query
 */
export function isMultiSelect<T>(ctx: FormState<T>, schema: Schema) {
  return isMultiSelectInternal(ctx, schema);
}

/**
 * @query
 */
export function isFilesArray<T>(ctx: FormState<T>, schema: Schema) {
  return isFilesArrayInternal(ctx, schema);
}

/**
 * @query
 */
export function retrieveSchema<T>(
  ctx: FormState<T>,
  schema: Schema,
  formData: SchemaValue | undefined,
  resolveAnyOfOrOneOfRefs?: boolean
) {
  return retrieveSchemaInternal(ctx, schema, formData, resolveAnyOfOrOneOfRefs);
}

/**
 * @query
 */
export function sanitizeDataForNewSchema<T>(
  ctx: FormState<T>,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaValue | undefined
) {
  return sanitizeDataForNewSchemaInternal(ctx, newSchema, oldSchema, formData);
}

/**
 * @query
 */
export function getClosestMatchingOption<T>(
  ctx: FormState<T>,
  formData: SchemaValue | undefined,
  options: Schema[],
  selectedOption: number,
  discriminatorField: string | undefined
) {
  return getClosestMatchingOptionInternal(
    ctx,
    formData,
    options,
    selectedOption,
    discriminatorField
  );
}

/**
 * @query
 */
export function getRenderedOptionSchema<T>(
  ctx: FormState<T>,
  parent: Schema,
  option: Schema
) {
  return getRenderedOptionSchemaInternal(ctx, parent, option);
}

/**
 * @query
 */
export function getDefaultFieldState<T>(
  ctx: FormState<T>,
  options: MergeFormDataAndSchemaDefaultsOptions
) {
  return ctx[CORE_MERGER].mergeFormDataAndSchemaDefaults(options);
}

export function markSchemaChange<T>(ctx: FormState<T>) {
  ctx[FORM_MARK_SCHEMA_CHANGE]();
}

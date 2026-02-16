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

import type { MergeFormDataAndSchemaDefaultsOptions } from "../merger.js";
import {
  FORM_MARK_SCHEMA_CHANGE,
  FORM_MERGER,
  FORM_SCHEMA,
  FORM_SCHEMAS_CACHE,
  FORM_VALIDATOR,
  internalGetStableSchema,
} from "../internals.js";
import type { FormState } from "./state.js";
import type { FieldPath } from "../id.js";

/**
 * @query
 */
export function isSelect<T>(ctx: FormState<T>, schema: Schema) {
  return isSelectInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA]
  );
}

/**
 * @query
 */
export function isMultiSelect<T>(ctx: FormState<T>, schema: Schema) {
  return isMultiSelectInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA]
  );
}

/**
 * @query
 */
export function isFilesArray<T>(ctx: FormState<T>, schema: Schema) {
  return isFilesArrayInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA]
  );
}

/**
 * @query
 * @deprecated use `retrieveStableSchema` instead
 */
// TODO: Remove in v4
export function retrieveSchema<T>(
  ctx: FormState<T>,
  schema: Schema,
  formData: SchemaValue | undefined,
  resolveAnyOfOrOneOfRefs?: boolean
) {
  return retrieveSchemaInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA],
    formData,
    resolveAnyOfOrOneOfRefs
  );
}

/**
 * @query
 */
export function retrieveStableSchema<T>(
  ctx: FormState<T>,
  path: FieldPath,
  schema: Schema,
  formData: SchemaValue | undefined,
  resolveAnyOfOrOneOfRefs?: boolean
) {
  return internalGetStableSchema(
    ctx[FORM_SCHEMAS_CACHE],
    path,
    retrieveSchema(ctx, schema, formData, resolveAnyOfOrOneOfRefs)
  );
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
  return sanitizeDataForNewSchemaInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    ctx[FORM_SCHEMA],
    newSchema,
    oldSchema,
    formData
  );
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
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    ctx[FORM_SCHEMA],
    formData,
    options,
    selectedOption,
    discriminatorField
  );
}

/**
 * @query
 */
export function getDefaultFieldState<T>(
  ctx: FormState<T>,
  options: MergeFormDataAndSchemaDefaultsOptions
) {
  return ctx[FORM_MERGER].mergeFormDataAndSchemaDefaults(options);
}

export function markSchemaChange<T>(ctx: FormState<T>) {
  ctx[FORM_MARK_SCHEMA_CHANGE]();
}

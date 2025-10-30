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
  FORM_VALIDATOR,
} from "../internals.js";
import type { FormState } from "./state.js";

/**
 * @query
 */
export function isSelect<I, O>(ctx: FormState<I, O>, schema: Schema) {
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
export function isMultiSelect<I, O>(ctx: FormState<I, O>, schema: Schema) {
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
export function isFilesArray<I, O>(ctx: FormState<I, O>, schema: Schema) {
  return isFilesArrayInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA]
  );
}

/**
 * @query
 */
export function retrieveSchema<I, O>(
  ctx: FormState<I, O>,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return retrieveSchemaInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA],
    formData
  );
}

/**
 * @query
 */
export function sanitizeDataForNewSchema<I, O>(
  ctx: FormState<I, O>,
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
export function getClosestMatchingOption<I, O>(
  ctx: FormState<I, O>,
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
export function getDefaultFieldState<I, O>(
  ctx: FormState<I, O>,
  options: MergeFormDataAndSchemaDefaultsOptions
) {
  return ctx[FORM_MERGER].mergeFormDataAndSchemaDefaults(options);
}

export function markSchemaChange<I, O>(ctx: FormState<I, O>) {
  ctx[FORM_MARK_SCHEMA_CHANGE]();
}

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

import {
  FORM_MARK_SCHEMA_CHANGE,
  FORM_MERGER,
  FORM_SCHEMA,
  FORM_VALIDATOR,
} from "../internals.js";
import type { FormState } from "./state.js";

export function isSelect<T, V extends Validator>(
  ctx: FormState<T, V>,
  schema: Schema
) {
  return isSelectInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA]
  );
}

export function isMultiSelect<T, V extends Validator>(
  ctx: FormState<T, V>,
  schema: Schema
) {
  return isMultiSelectInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA]
  );
}

export function isFilesArray<T, V extends Validator>(
  ctx: FormState<T, V>,
  schema: Schema
) {
  return isFilesArrayInternal(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    schema,
    ctx[FORM_SCHEMA]
  );
}

export function retrieveSchema<T, V extends Validator>(
  ctx: FormState<T, V>,
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

export function sanitizeDataForNewSchema<T, V extends Validator>(
  ctx: FormState<T, V>,
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

export function getClosestMatchingOption<T, V extends Validator>(
  ctx: FormState<T, V>,
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

export function getDefaultFieldState<T, V extends Validator>(
  ctx: FormState<T, V>,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return ctx[FORM_MERGER].mergeFormDataAndSchemaDefaults(formData, schema);
}

export function markSchemaChange<T, V extends Validator>(ctx: FormState<T, V>) {
  ctx[FORM_MARK_SCHEMA_CHANGE]();
}

import {
  isSelect as isSelectInternal,
  isMultiSelect as isMultiSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  getDefaultFormState as getDefaultFormStateInternal,
  getClosestMatchingOption as getClosestMatchingOptionInternal,
  sanitizeDataForNewSchema as sanitizeDataForNewSchemaInternal,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

import type { UiSchema } from "./ui-schema.js";
import {
  type IdSchema,
  toIdSchema as toIdSchemaInternal,
} from "./id-schema.js";
import type { FormContext } from "./context.js";
import { NO_ERRORS } from "./errors.js";
import type { Config } from './config.js';

export function getErrors(ctx: FormContext, idSchema: IdSchema<SchemaValue>) {
  return ctx.errors.get(idSchema.$id) ?? NO_ERRORS;
}

export function validateField(ctx: FormContext, config: Config, value: SchemaValue | undefined) {
  const errors = ctx.validator.validateFieldData(config, value);
  if (errors.length === 0) {
    ctx.errors.delete(config.idSchema.$id);
  } else {
    ctx.errors.set(config.idSchema.$id, errors);
  }
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

export function retrieveSchema(
  ctx: FormContext,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  return retrieveSchemaInternal(ctx.validator, schema, ctx.schema, formData);
}

export function getUiOptions(ctx: FormContext, uiSchema: UiSchema) {
  const globalUiOptions = ctx.uiSchema["ui:globalOptions"];
  const uiOptions = uiSchema["ui:options"];
  return globalUiOptions !== undefined
    ? { ...globalUiOptions, ...uiOptions }
    : uiOptions;
}

export function isSelect(ctx: FormContext, schema: Schema) {
  return isSelectInternal(ctx.validator, schema, ctx.schema);
}

export function isMultiSelect(ctx: FormContext, schema: Schema) {
  return isMultiSelectInternal(ctx.validator, schema, ctx.schema);
}

export function toIdSchema(
  ctx: FormContext,
  schema: Schema,
  id?: string,
  formData?: SchemaValue
): IdSchema<SchemaValue> {
  return toIdSchemaInternal(
    ctx.validator,
    schema,
    ctx.idPrefix,
    ctx.idSeparator,
    [],
    id,
    ctx.schema,
    formData
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
    ctx.schema,
    false
  );
}

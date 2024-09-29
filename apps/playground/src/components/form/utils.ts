import type { FormContext } from "./context";
import type { UiOptions, UiSchema } from "./ui-schema";
import {
  isSelect as isSelectInternal,
  isMultiSelect as isMultiSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  getDefaultFormState as getDefaultFormStateInternal,
  type Schema,
  type SchemaValue,
} from "./schema";
import { toIdSchema as toIdSchemaInternal, type IdSchema } from "./id-schema";

export function retrieveSchema<T extends SchemaValue>(
  ctx: FormContext<T>,
  schema: Schema,
  formData: T | undefined
) {
  return retrieveSchemaInternal(ctx.validator, schema, ctx.schema, formData);
}

export function getUiOptions(ctx: FormContext<unknown>, uiSchema: UiSchema) {
  const globalUiOptions = ctx.uiSchema["ui:globalOptions"];
  const uiOptions = uiSchema["ui:options"];
  return globalUiOptions !== undefined
    ? { ...globalUiOptions, ...uiOptions }
    : uiOptions;
}

export function getTemplateProps(
  _: FormContext<unknown>,
  name: string,
  schema: Schema,
  uiOptions: UiOptions | undefined
) {
  return {
    title: uiOptions?.title ?? schema.title ?? name,
    showMeta: uiOptions?.hideTitle !== true,
    description: uiOptions?.description ?? schema.description,
  };
}

export function isSelect(ctx: FormContext<unknown>, schema: Schema) {
  return isSelectInternal(ctx.validator, schema, ctx.schema);
}

export function isMultiSelect(ctx: FormContext<unknown>, schema: Schema) {
  return isMultiSelectInternal(ctx.validator, schema, ctx.schema);
}

export function toIdSchema<T extends SchemaValue>(
  ctx: FormContext<T>,
  schema: Schema,
  id?: string,
  formData?: T
): IdSchema<T> {
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

export function getDefaultFormState<T extends SchemaValue>(
  ctx: FormContext<T>,
  schema: Schema,
  formData: T | undefined
) {
  return getDefaultFormStateInternal(
    ctx.validator,
    schema,
    formData,
    ctx.schema,
    false
  );
}

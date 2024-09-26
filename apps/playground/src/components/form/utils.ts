import type { Component, ComponentType } from "./component";
import type { FormContext } from "./context";
import type { UiSchema } from "./ui-schema";
import type { Field, FieldType } from "./fields";
import {
  isSelect as isSelectInternal,
  isMultiSelect as isMultiSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  getDefaultFormState as getDefaultFormStateInternal,
  isFilesArray as isFilesArrayInternal,
  type Schema,
  type SchemaValue,
  type SchemaArrayValue,
} from "./schema";
import type {
  CompatibleWidgetType,
  Widget,
  WidgetCommonProps,
  WidgetType,
} from "./widgets";
import { toIdSchema as toIdSchemaInternal, type IdSchema } from "./id-schema";
import type { Template, TemplateType } from "./templates";
import Message from "./message.svelte";

const createMessage =
  (message: string): typeof Message =>
  // @ts-expect-error
  (internal) =>
    Message(internal, { message });

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

function getWidgetInternal<T extends WidgetType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Widget<CompatibleWidgetType<T>> | undefined {
  const widget = uiSchema["ui:options"]?.widget;
  switch (typeof widget) {
    case "undefined":
      return ctx.widgets(type);
    case "string":
      return ctx.widgets(widget as T);
    default:
      return widget as Widget<CompatibleWidgetType<T>>;
  }
}

export function getWidget<T extends WidgetType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Widget<CompatibleWidgetType<T>> {
  return (
    getWidgetInternal(ctx, type, uiSchema) ??
    (createMessage(`Widget ${type} not found`) as Widget<
      CompatibleWidgetType<T>
    >)
  );
}

function getFieldInternal<T extends FieldType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Field<T> | undefined {
  const field = uiSchema["ui:field"];
  switch (typeof field) {
    case "undefined":
      return ctx.fields(type, uiSchema);
    case "string":
      return ctx.fields(field as T, uiSchema);
    default:
      return field as Field<T>;
  }
}

export function getField<T extends FieldType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Field<T> {
  return (
    getFieldInternal(ctx, type, uiSchema) ??
    (ctx.fields("unsupported", uiSchema) as Field<T>) ??
    createMessage(`Field ${type} not found`)
  );
}

function getTemplateInternal<T extends TemplateType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Template<T> | undefined {
  const template = uiSchema["ui:template"];
  switch (typeof template) {
    case "undefined":
      return ctx.templates(type, uiSchema);
    case "string":
      return ctx.templates(template as T, uiSchema);
    default:
      return template as Template<T>;
  }
}

export function getTemplate<T extends TemplateType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Template<T> {
  return (
    getTemplateInternal(ctx, type, uiSchema) ??
    (createMessage(`Template ${type} not found`) as Template<T>)
  );
}

function getComponentInternal<T extends ComponentType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Component<T> | undefined {
  const component = uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return ctx.components(type, uiSchema);
    case "string":
      return ctx.components(component as T, uiSchema);
    default:
      return component as Component<T>;
  }
}

export function getComponent<T extends ComponentType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Component<T> {
  // @ts-expect-error TODO: improve `createMessage` type
  return (
    getComponentInternal(ctx, type, uiSchema) ??
    createMessage(`Component ${type} not found`)
  );
}

export function getComponentProps(
  ctx: FormContext<unknown>,
  uiSchema: UiSchema
) {
  const uiOptions = getUiOptions(ctx, uiSchema);
  return {
    class: uiOptions?.class,
    style: uiOptions?.style,
    disabled: uiOptions?.disabled || ctx.disabled,
    readonly: uiOptions?.readonly || ctx.readonly,
  };
}

export function getWidgetProps<T>(
  ctx: FormContext<T>,
  name: string,
  schema: Schema,
  uiSchema: UiSchema,
  idSchema: IdSchema<T>
) {
  const uiOptions = getUiOptions(ctx, uiSchema);
  return {
    schema,
    uiSchema,
    id: idSchema.$id,
    label: uiOptions?.title ?? schema.title ?? name,
    disabled: uiOptions?.disabled || ctx.disabled,
    readonly: uiOptions?.readonly || ctx.readonly,
    autofocus: uiOptions?.autofocus || false,
    placeholder: uiOptions?.placeholder || "",
  } satisfies Omit<WidgetCommonProps<T>, "value" | "required">;
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
  formData?: T
) {
  return getDefaultFormStateInternal(
    ctx.validator,
    schema,
    formData,
    ctx.schema,
    false
  );
}

export function canExpand<T>(
  ctx: FormContext<T>,
  schema: Schema,
  uiSchema: UiSchema,
  formData?: T
) {
  if (!schema.additionalProperties) {
    return false;
  }
  const expandable = getUiOptions(ctx, uiSchema)?.expandable;
  if (expandable === false) {
    return false;
  }
  if (schema.maxProperties !== undefined && formData) {
    return Object.keys(formData).length < schema.maxProperties;
  }
  return true;
}

export function isFilesArray(ctx: FormContext<unknown>, schema: Schema) {
  return isFilesArrayInternal(ctx.validator, schema, ctx.schema);
}

export function getArrayItemSchemaId(
  ctx: FormContext<unknown>,
  arrayIdSchema: IdSchema<SchemaArrayValue>,
  itemSchema: Schema,
  index: number,
  value: SchemaValue | undefined
) {
  const idPrefix = `${arrayIdSchema.$id}${ctx.idSeparator}${index}`;
  return toIdSchemaInternal(
    ctx.validator,
    itemSchema,
    idPrefix,
    ctx.idSeparator,
    [],
    ctx.idPrefix,
    ctx.schema,
    value
  );
}

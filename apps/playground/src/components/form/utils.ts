import type { Component, ComponentType } from "./component";
import type { FormContext } from "./context";
import type { UiSchema } from "./ui-schema";
import type { Field, FieldType } from "./fields";
import {
  isSelect as isSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  getDefaultFormState as getDefaultFormStateInternal,
  type Schema,
  type SchemaValue,
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

export function getField<T extends FieldType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Field<T> {
  return (
    ctx.fields(type, uiSchema) ??
    (ctx.fields("unsupported", uiSchema) as Field<T>) ??
    createMessage(`Field ${type} not found`)
  );
}

export function getTemplate<T extends TemplateType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Template<T> {
  return (
    ctx.templates(type, uiSchema) ??
    (createMessage(`Template ${type} not found`) as Template<T>)
  );
}

export function getComponent<T extends ComponentType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Component<T> {
  // @ts-expect-error TODO: Fix this, currently this can fail
  // when some component with a binding missed in message component
  // will not be found
  return (
    ctx.components(type, uiSchema) ??
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

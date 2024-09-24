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

export function retrieveSchema<T extends SchemaValue>(
  ctx: FormContext<T>,
  schema: Schema,
  formData: T | undefined
) {
  return retrieveSchemaInternal(ctx.validator, schema, ctx.schema, formData);
}

export function getWidget<T extends WidgetType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Widget<CompatibleWidgetType<T>> {
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

export function getField<T extends FieldType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema,
  checkForUndefined = true
): Field<T> {
  if (checkForUndefined) {
    return (
      getField(ctx, type, uiSchema, false) ??
      ctx.fields("unsupported", uiSchema)
    );
  }
  return ctx.fields(type, uiSchema);
}

export function getTemplate<T extends TemplateType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Template<T> {
  return ctx.templates(type, uiSchema);
}

export function getComponent<T extends ComponentType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Component<T> {
  return ctx.components(type, uiSchema);
}

export function getComponentProps(
  ctx: FormContext<unknown>,
  uiSchema: UiSchema
) {
  return {
    class: uiSchema["ui:options"]?.class,
    style: uiSchema["ui:options"]?.style,
    disabled: ctx.disabled || uiSchema["ui:options"]?.disabled,
    readonly: ctx.readonly || uiSchema["ui:options"]?.readonly,
  };
}

export function getWidgetProps<T>(
  ctx: FormContext<T>,
  name: string,
  schema: Schema,
  uiSchema: UiSchema,
  idSchema: IdSchema<T>
) {
  return {
    schema,
    uiSchema,
    id: idSchema.$id,
    label: uiSchema["ui:options"]?.title ?? schema.title ?? name,
    disabled: uiSchema["ui:options"]?.disabled || ctx.disabled,
    readonly: uiSchema["ui:options"]?.readonly || ctx.readonly,
    autofocus: uiSchema["ui:options"]?.autofocus || false,
    placeholder: uiSchema["ui:options"]?.placeholder || "",
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
  _: FormContext<T>,
  schema: Schema,
  uiSchema: UiSchema,
  formData?: T
) {
  if (!schema.additionalProperties) {
    return false;
  }
  const expandable = uiSchema["ui:options"]?.expandable;
  if (expandable === false) {
    return false
  }
  if (schema.maxProperties !== undefined && formData) {
    return Object.keys(formData).length < schema.maxProperties;
  }
  return true;
}
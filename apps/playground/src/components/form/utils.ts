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
import type { Widget, WidgetCommonProps, WidgetType } from "./widgets";
import { toIdSchema as toIdSchemaInternal, type IdSchema } from "./id-schema";

export function retrieveSchema<T extends SchemaValue>(
  ctx: FormContext<T>,
  schema: Schema,
  formData: T
) {
  return retrieveSchemaInternal(ctx.validator, schema, ctx.schema, formData);
}

export function getWidget<T extends WidgetType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Widget<T> {
  const widget = uiSchema["ui:options"]?.widget;
  switch (typeof widget) {
    case "undefined":
      return ctx.widgets(type);
    case "string":
      return ctx.widgets(widget as T);
    default:
      return widget as Widget<T>;
  }
}

export function getField<T extends FieldType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Field<T> {
  const field = uiSchema["ui:options"]?.field;
  switch (typeof field) {
    case "undefined":
      return ctx.fields(type);
    case "string":
      return ctx.fields(field as T);
    default:
      return field;
  }
}

export function getComponent<T extends ComponentType>(
  ctx: FormContext<unknown>,
  type: T,
  uiSchema: UiSchema
): Component<T> {
  const component = uiSchema["ui:options"]?.component;
  switch (typeof component) {
    case "undefined":
      return ctx.components(type);
    case "string":
      return ctx.components(component as T);
    default:
      return component as Component<T>;
  }
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

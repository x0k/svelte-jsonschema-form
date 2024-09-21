import type { Component, ComponentType } from "./component";
import type { FormContext } from "./context";
import type { UiSchema } from "./ui-schema";
import type { Field, FieldType } from "./fields";
import {
  isSelect as isSelectInternal,
  retrieveSchema as retrieveSchemaInternal,
  type Schema,
} from "./schema";
import type { Widget, WidgetType } from "./widgets";
import { toIdSchema as toIdSchemaInternal, type IdSchema } from "./id-schema";

export function retrieveSchema<T>(
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

export function getTitle(
  schema: Schema,
  uiSchema: UiSchema,
) {
  return uiSchema["ui:options"]?.title ?? schema.title
}

export function getAttributes(ctx: FormContext<unknown>, uiSchema: UiSchema) {
  return {
    class: uiSchema["ui:options"]?.class,
    style: uiSchema["ui:options"]?.style,
    disabled: ctx.disabled || uiSchema["ui:options"]?.disabled,
    readonly: ctx.readonly || uiSchema["ui:options"]?.readonly,
  };
}

export function isSelect(ctx: FormContext<unknown>, schema: Schema) {
  return isSelectInternal(ctx.validator, schema, ctx.schema);
}

export function toIdSchema<T>(
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

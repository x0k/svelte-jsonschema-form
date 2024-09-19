import type { Component, ComponentType } from "./component";
import type { FormContext } from "./context";
import type { UiSchema } from "./ui-schema";
import type { Field, FieldType } from "./fields";
import { isSelect as isSelectInternal, type Schema } from "./schema";

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
  defaultValue = ""
) {
  return uiSchema["ui:options"]?.title ?? schema.title ?? defaultValue;
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

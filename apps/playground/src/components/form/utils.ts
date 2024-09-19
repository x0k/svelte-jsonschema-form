import type { Component, ComponentOptions, ComponentType } from "./component";
import type { FormContext } from "./context.svelte";
import { isSelect as isSelectInternal } from "./schema";

export function getComponent<T extends ComponentType>(
  ctx: FormContext<unknown>,
  type: T,
  options: ComponentOptions
): Component<T> {
  return (
    (options.uiSchema["ui:options"]?.component as Component<T> | undefined) ??
    ctx.components(type, options)
  );
}

export function getTitle(
  { schema, uiSchema }: ComponentOptions,
  defaultValue = ""
) {
  return uiSchema["ui:options"]?.title ?? schema.title ?? defaultValue;
}

export function getAttributes(
  ctx: FormContext<unknown>,
  options: ComponentOptions
) {
  return {
    class: options.uiSchema["ui:options"]?.class,
    style: options.uiSchema["ui:options"]?.style,
    disabled: ctx.disabled || options.uiSchema["ui:options"]?.disabled,
    readonly: ctx.readonly || options.uiSchema["ui:options"]?.readonly,
  };
}

export function isSelect(ctx: FormContext<unknown>, options: ComponentOptions) {
  return isSelectInternal(ctx.validator, options.schema, ctx.schema);
}

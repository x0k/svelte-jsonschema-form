import type { Snippet, Component as SvelteComponent } from "svelte";

import type {
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "../schema";
import { createMessage, type Config } from "../config";
import type { FormContext } from "../context";

export interface TemplateCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config<V>;
}

export interface ObjectTemplateProps
  extends TemplateCommonProps<SchemaObjectValue> {
  addButton?: Snippet;
  children: Snippet;
}

export interface ObjectPropertyTemplateProps
  extends TemplateCommonProps<SchemaValue> {
  property: string;
  keyInput?: Snippet;
  removeButton?: Snippet;
  children: Snippet;
}

export interface ArrayTemplateProps
  extends TemplateCommonProps<SchemaArrayValue> {
  addButton?: Snippet;
  children: Snippet;
}

export interface ArrayItemTemplateProps
  extends TemplateCommonProps<SchemaValue> {
  index: number;
  buttons?: Snippet;
  children: Snippet;
}

export interface FieldTemplateProps extends TemplateCommonProps<SchemaValue> {
  showTitle: boolean;
  children: Snippet;
}

export interface TemplateAndProps {
  field: FieldTemplateProps;
  object: ObjectTemplateProps;
  "object-property": ObjectPropertyTemplateProps;
  array: ArrayTemplateProps;
  "array-item": ArrayItemTemplateProps;
}

export type TemplateType = keyof TemplateAndProps;

export type TemplateProps<T extends TemplateType> = TemplateAndProps[T];

export type Template<T extends TemplateType> = SvelteComponent<
  TemplateProps<T>,
  {},
  ""
>;

export type Templates = <T extends TemplateType>(
  type: T,
  config: Config
) => Template<T> | undefined;

function getTemplateInternal<T extends TemplateType>(
  ctx: FormContext<unknown>,
  type: T,
  config: Config
): Template<T> | undefined {
  const template = config.uiSchema["ui:templates"]?.[type];
  switch (typeof template) {
    case "undefined":
      return ctx.templates(type, config);
    case "string":
      return ctx.templates(template as T, config);
    default:
      return template as Template<T>;
  }
}

export function getTemplate<T extends TemplateType>(
  ctx: FormContext<unknown>,
  type: T,
  config: Config
): Template<T> {
  return (
    getTemplateInternal(ctx, type, config) ??
    (createMessage(
      `Template "${config.uiSchema["ui:templates"]?.[type] ?? type}" not found`
    ) as Template<T>)
  );
}

import type { Snippet, Component as SvelteComponent } from "svelte";

import { fromRecord, type Resolver } from "@/lib/resolver.js";
import type {
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "@/core/index.js";

import type { Config } from "./config.js";
import type { FieldErrors } from "./errors.js";

export interface TemplateCommonProps<V extends SchemaValue> {
  value: V | undefined;
  config: Config<V>;
  errors: FieldErrors;
  children: Snippet;
}

export interface ObjectTemplateProps
  extends TemplateCommonProps<SchemaObjectValue> {
  addButton?: Snippet;
}

export interface ObjectPropertyTemplateProps
  extends TemplateCommonProps<SchemaValue> {
  property: string;
  keyInput?: Snippet;
  removeButton?: Snippet;
}

export interface ArrayTemplateProps
  extends TemplateCommonProps<SchemaArrayValue> {
  addButton?: Snippet;
}

export interface ArrayItemTemplateProps
  extends TemplateCommonProps<SchemaValue> {
  index: number;
  buttons?: Snippet;
}

export interface FieldTemplateProps extends TemplateCommonProps<SchemaValue> {
  showTitle: boolean;
}

export interface MultiTemplateProps extends TemplateCommonProps<SchemaValue> {
  optionSelector: Snippet;
}

export interface TemplateAndProps {
  field: FieldTemplateProps;
  object: ObjectTemplateProps;
  "object-property": ObjectPropertyTemplateProps;
  array: ArrayTemplateProps;
  "array-item": ArrayItemTemplateProps;
  multi: MultiTemplateProps;
}

export type TemplateType = keyof TemplateAndProps;

export type TemplateProps<T extends TemplateType> = TemplateAndProps[T];

export type Template<T extends TemplateType> = SvelteComponent<
  TemplateProps<T>,
  {},
  ""
>;

export type Templates = {
  [T in TemplateType]: Template<T>;
};

export type TemplatesResolver = Resolver<
  TemplateType,
  Config,
  Templates,
  undefined
>;

export const createTemplates = fromRecord as (
  r: Partial<Templates>
) => TemplatesResolver;

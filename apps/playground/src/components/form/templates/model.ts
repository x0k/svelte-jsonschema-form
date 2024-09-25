import type { Snippet, Component as SvelteComponent } from "svelte";

import type { Schema, SchemaValue } from "../schema";
import type { UiSchema } from "../ui-schema";
import type { IdSchema } from "../id-schema";

export interface TemplateCommonProps<V extends SchemaValue> {
  name: string;
  value: V | undefined;
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchema<V>;
  required: boolean;
}

export interface ObjectTemplateProps {
  title?: Snippet;
  description?: Snippet;
  addButton?: Snippet;
  children: Snippet;
}

export interface ArrayTemplateProps {
  title?: Snippet;
  description?: Snippet;
  addButton?: Snippet;
  children: Snippet;
}

export interface TemplateAndProps {
  object: ObjectTemplateProps;
  array: ArrayTemplateProps;
}

export type TemplateType = keyof TemplateAndProps;

export type TemplateProps<T extends TemplateType> = TemplateAndProps[T] &
  TemplateCommonProps<SchemaValue>;

export type Template<T extends TemplateType> = SvelteComponent<
  TemplateProps<T>,
  {},
  ""
>;

export type Templates = <T extends TemplateType>(
  type: T,
  uiSchema: UiSchema
) => Template<T> | undefined;

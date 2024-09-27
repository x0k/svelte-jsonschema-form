import type { Snippet, Component as SvelteComponent } from "svelte";

import type {
  Schema,
  SchemaArrayValue,
  SchemaObjectValue,
  SchemaValue,
} from "../schema";
import type { UiOptions, UiSchema } from "../ui-schema";
import type { IdSchema } from "../id-schema";

export interface TemplateCommonProps<
  V extends SchemaValue,
  IdSchemaType = IdSchema<V>
> {
  name: string;
  value: V | undefined;
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchemaType;
  uiOptions: UiOptions | undefined;
  required: boolean;
}

export interface ObjectTemplateProps
  extends TemplateCommonProps<SchemaObjectValue> {
  addButton?: Snippet;
  children: Snippet;
}

export interface ObjectPropertyTemplateProps
  extends TemplateCommonProps<SchemaValue, IdSchema<SchemaValue> | undefined> {
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
  uiSchema: UiSchema
) => Template<T> | undefined;

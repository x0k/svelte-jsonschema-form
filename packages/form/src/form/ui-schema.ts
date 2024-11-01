import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { SchemaValue } from "@/core/index.js";

import type { Component, ComponentType } from "./component.js";
import type { Field, FieldType } from "./fields/index.js";
import type { Template, TemplateType } from "./templates/index.js";
import type { Widget, WidgetType } from "./widgets.js";

export type UiSchemaRoot = UiSchemaRootIndex & UiSchemaRootContent;

interface UiSchemaRootIndex {
  [key: string]: UiSchemaRootContent[keyof UiSchemaRootContent];
}

type UiSchemaRootContent = UiSchemaContent & {
  "ui:rootFieldId"?: string;
  "ui:globalOptions"?: UiOptions;
  submitButton?: UiSchema;
};

type AllFields = {
  [T in FieldType]: Field<T>;
};

interface UiSchemaContent {
  "ui:options"?: UiOptions;
  "ui:widget"?: WidgetType | Widget<WidgetType>;
  "ui:field"?: FieldType | AllFields[FieldType];
  "ui:templates"?: Partial<{
    [T in TemplateType]: TemplateType | Template<T>;
  }>;
  "ui:components"?: Partial<{
    [T in ComponentType]: ComponentType | Component<T>;
  }>;
  items?: UiSchema | UiSchema[];
  anyOf?: UiSchema[];
  oneOf?: UiSchema[];
  additionalProperties?: UiSchema;
  additionalPropertyKeyInput?: UiSchema;
  additionalItems?: UiSchema;
}

export interface Inputs {
  input: HTMLInputAttributes;
  textarea: HTMLTextareaAttributes;
  select: HTMLSelectAttributes;
}

export type InputAttributes = Inputs[keyof Inputs];

export interface UiOptions {
  /**
   * Overrides the input attributes.
   * `readonly` and `disabled` attributes are mixed with the form state.
   */
  input?: InputAttributes;
  /**
   * Overrides the attributes of a `layout` component that wraps around widget component.
   */
  content?: HTMLAttributes<HTMLDivElement>;
  /**
   * Overrides the attributes of the `layout` component that wraps the entire field.
   */
  container?: HTMLAttributes<HTMLDivElement>;
  /**
   * Overrides the attributes of the main button component of the field.
   */
  button?: HTMLButtonAttributes;
  // TODO: Clarify the need for this
  // root?: HTMLAttributes<HTMLDivElement>
  /**
   * Overrides the title of the field.
   */
  title?: string;
  /**
   * Overrides the description of the field (over the widget).
   */
  description?: string;
  /**
   * List of labels for enum values in the schema.
   */
  enumNames?: string[];
  /**
   * List of enum values that are disabled. Values are compared by string equality.
   */
  disabledEnumValues?: SchemaValue[];
  /**
   * Order of properties in the object schema.
   * You must specify all properties or use the wildcard `*`.
   */
  order?: string[];
  /**
   * Allow adding new properties to the object schema with `additionalProperties`.
   * @default true
   */
  expandable?: boolean;
  /**
   * Allow adding new items to the array schema.
   * @default true
   */
  addable?: boolean;
  /**
   * Allow reordering items in the array schema.
   * If you want an orderable array of file fields, set this to `true` explicitly.
   * @default true
   */
  orderable?: boolean;
  /**
   * Allow removing items from the array schema.
   * @default true
   */
  removable?: boolean;
  /**
   * Allow duplicating items in the array schema.
   * @default false
   */
  copyable?: boolean;
  /**
   * Separator between key and integer suffix in the key of a new property in a schema with `additionalProperties`.
   * @default '-'
   */
  duplicateKeySuffixSeparator?: string;
  /**
   * Help text for the field (under the widget).
   */
  help?: string;
  /**
   * Hide the title of the field.
   * If you want to show a title of the `boolean` field this should be set to `false` explicitly.
   * @default false
   */
  hideTitle?: boolean;
  /**
   * Default value to use when an input for a field is empty
   */
  emptyValue?: SchemaValue;
}

export type UiSchema = UiSchemaIndex & UiSchemaContent;

interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}

import type {
  HTMLAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { SchemaValue } from "@/core/index.js";

import type {
  CompatibleComponentType,
  ComponentType,
  Definitions,
} from "./theme.js";

export type UiSchemaRoot = UiSchemaRootIndex & UiSchemaRootContent;

export interface UiSchemaRootIndex {
  [key: string]: UiSchemaRootContent[keyof UiSchemaRootContent];
}

export interface UiSchemaRootContent extends UiSchemaContent {
  "ui:globalOptions"?: UiOptions;
}

export interface UiSchemaContent {
  "ui:options"?: UiOptions;
  "ui:components"?: Partial<{
    [T in ComponentType]: CompatibleComponentType<T> | Definitions[T];
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
   * List of enum values that are disabled. Values are compared by strict equality.
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

export interface UiSchemaIndex {
  [key: string]: UiSchemaContent[keyof UiSchemaContent];
}

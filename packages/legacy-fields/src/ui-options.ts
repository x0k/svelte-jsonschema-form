import type { SchemaValue } from "@sjsf/form";

declare module "@sjsf/form" {
  interface UiOptions {
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
}

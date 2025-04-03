import type { SchemaValue } from "@/form/index.js";

declare module "../form/index.js" {
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
     * Prefix of the new additional property key
     * @default 'newKey'
     */
    additionalPropertyKeyPrefix?: string
    /**
     * Separator between the prefix of the optional property key and its integer suffix.
     * @default '-'
     */
    additionalPropertyKeySeparator?: string;
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
     * Overrides whether to use the `title` or `label` component in the `field` template
     */
    useLabel?: boolean
  }
}

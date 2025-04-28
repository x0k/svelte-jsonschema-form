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
    useLabel?: boolean;
  }
}

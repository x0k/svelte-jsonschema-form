import type { SchemaValue } from "@/form/index.js";
import type { EnumValueMapperBuilder } from "@/options.svelte.js";

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
     * Overrides the enumeration value mapper (may be required for autofill to work)
     * @default () => new IdEnumValueMapperBuilder()
     */
    enumValueMapperBuilder?: () => EnumValueMapperBuilder;
    /**
     * Determines whether the current field can be cleared (e.g., the empty option in the select widget)
     */
    clearable?: boolean;
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
    /**
     * Display errors from child elements (applies only to aggregating fields like `tags`).
     * @default false
     */
    collectErrors?: boolean;
  }
}

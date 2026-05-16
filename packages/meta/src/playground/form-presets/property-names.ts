import type { FormPresetCategory, FormPreset } from "../form-preset.ts";

export const category: FormPresetCategory = "Schema Basics";

export default {
  schema: {
    title: "Property names example",
    type: "object",
    additionalProperties: {
      type: "number",
    },
    propertyNames: {
      enum: ["foo", "bar", "baz"],
    },
  },
  uiSchema: {
    additionalProperties: {
      additionalPropertyKeyInput: {
        "ui:components": {
          enumField: "objectKeyEnumField",
        },
      },
    },
  },
  initialValue: {
    foo: 123,
  },
} satisfies FormPreset;

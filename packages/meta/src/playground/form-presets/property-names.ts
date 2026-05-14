import type { PlaygroundPresetCategory, FormPreset } from "../form-state.ts";

export const category: PlaygroundPresetCategory = "Schema Basics";

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

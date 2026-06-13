import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  title: "Property Names",
  description:
    "Property name pattern validation using the propertyNames keyword.",
  tags: [PresetTag.Validation, PresetTag.Object],
});

export default definePreset({
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
});

import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
  jsonSchema,
  jsonUiSchema,
  jsonValue,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  schemaFormat: "json-schema",
  draft2020: false,
  title: "Property Names",
  description:
    "Property name pattern validation using the propertyNames keyword.",
  tags: [PresetTag.Validation, PresetTag.Object],
});

export default definePreset({
  schema: jsonSchema({
    title: "Property names example",
    type: "object",
    additionalProperties: {
      type: "number",
    },
    propertyNames: {
      enum: ["foo", "bar", "baz"],
    },
  }),
  uiSchema: jsonUiSchema({
    additionalProperties: {
      additionalPropertyKeyInput: {
        "ui:components": {
          enumField: "objectKeyEnumField",
        },
      },
    },
  }),
  initialValue: jsonValue({
    foo: 123,
  }),
});

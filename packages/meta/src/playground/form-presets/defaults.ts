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
  schema: { type: "json", draft2020: false },
  title: "Defaults",
  description:
    "Default value propagation from schema definitions and property defaults.",
  tags: [PresetTag.Validation, PresetTag.Object],
});

export default definePreset({
  schema: jsonSchema({
    title: "Schema default properties",
    type: "object",
    properties: {
      valuesInFormData: {
        title: "Values in form data",
        $ref: "#/definitions/defaultsExample",
      },
      noValuesInFormData: {
        title: "No values in form data",
        $ref: "#/definitions/defaultsExample",
      },
    },
    definitions: {
      defaultsExample: {
        type: "object",
        properties: {
          scalar: {
            title: "Scalar",
            type: "string",
            default: "scalar default",
          },
          array: {
            title: "Array",
            type: "array",
            items: {
              type: "object",
              properties: {
                nested: {
                  title: "Nested array",
                  type: "string",
                  default: "nested array default",
                },
              },
            },
          },
          object: {
            title: "Object",
            type: "object",
            properties: {
              nested: {
                title: "Nested object",
                type: "string",
                default: "nested object default",
              },
            },
          },
        },
      },
    },
  }),
  uiSchema: jsonUiSchema({}),
  initialValue: jsonValue({
    valuesInFormData: {
      scalar: "value",
      array: [
        {
          nested: "nested array value",
        },
      ],
      object: {
        nested: "nested object value",
      },
    },
    noValuesInFormData: {
      array: [{}, {}],
    },
  }),
});

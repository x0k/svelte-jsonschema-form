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
  category: FormPresetCategory.SchemaLogic,
  schemaFormat: "json-schema",
  draft2020: false,
  title: "Any Of",
  description:
    "Schema anyOf composition with multiple valid schemas and conditional rendering.",
  tags: [PresetTag.Composition],
});

export default definePreset({
  schema: jsonSchema({
    type: "object",
    properties: {
      age: {
        type: "integer",
        title: "Age",
      },
      items: {
        type: "array",
        items: {
          type: "object",
          anyOf: [
            {
              properties: {
                foo: {
                  type: "string",
                },
              },
            },
            {
              properties: {
                bar: {
                  type: "string",
                },
              },
            },
          ],
        },
      },
    },
    anyOf: [
      {
        title: "First method of identification",
        properties: {
          firstName: {
            type: "string",
            title: "First name",
            default: "Chuck",
          },
          lastName: {
            type: "string",
            title: "Last name",
          },
        },
      },
      {
        title: "Second method of identification",
        properties: {
          idCode: {
            type: "string",
            title: "ID code",
          },
        },
      },
    ],
  }),
  uiSchema: jsonUiSchema({}),
  initialValue: jsonValue({}),
});

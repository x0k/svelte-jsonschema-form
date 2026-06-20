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
  category: FormPresetCategory.Other,
  schemaFormat: "json-schema",
  draft2020: false,
  title: "Errors",
  description:
    "Validation error display and custom error messaging strategies.",
  tags: [PresetTag.Validation],
});

export default definePreset({
  resolver: "compat",
  schema: jsonSchema({
    title: "Contextualized errors",
    type: "object",
    properties: {
      firstName: {
        type: "string",
        title: "First name",
        minLength: 8,
        pattern: "\\d+",
      },
      active: {
        type: "boolean",
        title: "Active",
      },
      skills: {
        type: "array",
        items: {
          type: "string",
          minLength: 5,
        },
        minItems: 4,
      },
      multipleChoicesList: {
        type: "array",
        title: "Pick max two items",
        uniqueItems: true,
        maxItems: 2,
        items: {
          type: "string",
          enum: ["foo", "bar", "fuzz"],
        },
      },
    },
  }),
  uiSchema: jsonUiSchema({}),
  initialValue: jsonValue({
    firstName: "Chuck",
    active: "wrong",
    skills: ["karate", "budo", "aikido"],
    multipleChoicesList: ["foo", "bar", "fuzz"],
  }),
});

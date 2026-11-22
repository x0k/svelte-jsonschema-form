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
  title: "Union",
  description:
    "Fields that accept more than one type, with a selector for the current type.",
  tags: [PresetTag.Composition],
});

export default definePreset({
  schema: jsonSchema({
    title: "Union types",
    description:
      "A `type` list renders a type selector over the listed types and the field for the selected one.",
    type: "object",
    properties: {
      stringOrNumber: {
        title: "String or number",
        description: "Switch between a text input and a numeric input.",
        type: ["string", "number"],
      },
      stringOrObject: {
        title: "String or object",
        description:
          "Switch between a text input and an object that accepts any property.",
        type: ["string", "object"],
        additionalProperties: true,
      },
      nullable: {
        title: "String or null",
        description: "A nullable single type keeps its plain field.",
        type: ["string", "null"],
      },
    },
  }),
  uiSchema: jsonUiSchema({}),
  formData: jsonValue({
    stringOrNumber: 42,
    stringOrObject: {
      anything: "goes",
    },
    nullable: "text",
  }),
});

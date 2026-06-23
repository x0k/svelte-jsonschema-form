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
  title: "Examples",
  description:
    "Schema-level examples keyword usage for input hints and placeholders.",
  tags: [PresetTag.Object],
});

export default definePreset({
  schema: jsonSchema({
    title: "Examples",
    description: "A text field with example values.",
    type: "object",
    properties: {
      browser: {
        type: "string",
        title: "Browser",
        examples: ["Firefox", "Chrome", "Opera", "Vivaldi", "Safari"],
      },
    },
  }),
  uiSchema: jsonUiSchema({}),
  initialValue: jsonValue({}),
});

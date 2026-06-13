import {
  defineMetadata,
  definePreset,
  FormPresetCategory,
  PresetTag,
} from "../form-preset.ts";

export const meta = defineMetadata({
  category: FormPresetCategory.SchemaBasics,
  title: "Examples",
  description:
    "Schema-level examples keyword usage for input hints and placeholders.",
  tags: [PresetTag.Object],
});

export default definePreset({
  schema: {
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
  },
  uiSchema: {},
  initialValue: {},
});

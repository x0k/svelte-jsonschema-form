import type { FormPresetCategory, FormPreset } from "../form-state.ts";

export const category: FormPresetCategory = "Schema Basics";

export default {
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
} satisfies FormPreset;

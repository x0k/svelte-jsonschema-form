import type { FormPresetCategory, FormPreset } from "../form-preset.ts";

export const category: FormPresetCategory = "Schema Basics";

export default {
  schema: {
    title: "A single-field form",
    type: "string",
  },
  initialValue: "initial value",
  uiSchema: {},
} satisfies FormPreset;

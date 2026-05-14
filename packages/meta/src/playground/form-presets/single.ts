import type { PlaygroundPresetCategory, FormPreset } from "../form-state.ts";

export const category: PlaygroundPresetCategory = "Schema Basics";

export default {
  schema: {
    title: "A single-field form",
    type: "string",
  },
  initialValue: "initial value",
  uiSchema: {},
} satisfies FormPreset;

import type { PlaygroundPresetCategory, PlaygroundPreset } from "../state.ts";

export const category: PlaygroundPresetCategory = "Schema Basics";

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
} satisfies PlaygroundPreset;

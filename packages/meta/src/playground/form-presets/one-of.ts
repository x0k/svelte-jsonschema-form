import type { PlaygroundPresetCategory, FormPreset } from "../form-state.ts";

export const category: PlaygroundPresetCategory = "Schema Logic";

export default {
  schema: {
    type: "object",
    oneOf: [
      {
        properties: {
          lorem: {
            type: "string",
          },
        },
        required: ["lorem"],
      },
      {
        properties: {
          ipsum: {
            type: "string",
          },
        },
        required: ["ipsum"],
      },
    ],
  },
  uiSchema: {},
  initialValue: {},
} satisfies FormPreset;

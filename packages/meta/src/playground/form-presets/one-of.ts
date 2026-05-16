import type { FormPresetCategory, FormPreset } from "../form-preset.ts";

export const category: FormPresetCategory = "Schema Logic";

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

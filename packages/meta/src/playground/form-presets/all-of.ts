import type { FormPresetCategory, FormPreset } from "../form-state.ts";

export const category: FormPresetCategory = "Schema Logic";

export default {
  schema: {
    type: "object",
    allOf: [
      {
        properties: {
          lorem: {
            type: ["string", "boolean"],
            default: true,
          },
        },
      },
      {
        properties: {
          lorem: {
            type: "boolean",
          },
          ipsum: {
            type: "string",
          },
        },
      },
    ],
  },
  uiSchema: {},
  initialValue: {},
} satisfies FormPreset;

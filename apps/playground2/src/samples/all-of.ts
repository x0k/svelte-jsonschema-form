import type { SampleCategory, Sample } from "@/core/index.js";

export const category: SampleCategory = "Schema Logic";

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
} satisfies Sample;

import type { Sample } from "@/shared/index.js";

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
  formData: {},
} satisfies Sample;

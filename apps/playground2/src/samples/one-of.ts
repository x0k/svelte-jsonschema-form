import type { SampleCategory, Sample } from "@/core/index.js";

export const category: SampleCategory = "Schema Logic";

export default {

  schema: {
    type: 'object',
    oneOf: [
      {
        properties: {
          lorem: {
            type: 'string',
          },
        },
        required: ['lorem'],
      },
      {
        properties: {
          ipsum: {
            type: 'string',
          },
        },
        required: ['ipsum'],
      },
    ],
  },
  uiSchema: {},
  initialValue: {},
} satisfies Sample;

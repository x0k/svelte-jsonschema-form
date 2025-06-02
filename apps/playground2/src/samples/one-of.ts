import type { Sample } from '@/shared/index.js';

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
  formData: {},
} satisfies Sample;

import type { Sample } from './Sample.js';

const allOf: Sample = {
  status: "perfect",
  schema: {
    type: 'object',
    allOf: [
      {
        properties: {
          lorem: {
            type: ['string', 'boolean'],
            default: true,
          },
        },
      },
      {
        properties: {
          lorem: {
            type: 'boolean',
          },
          ipsum: {
            type: 'string',
          },
        },
      },
    ],
  },
  uiSchema: {},
  formData: {},
};

export default allOf;

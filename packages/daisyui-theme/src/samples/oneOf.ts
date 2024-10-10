import type { Sample } from './Sample.js';

const oneOf: Sample = {
  status: "perfect",
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
};

export default oneOf;

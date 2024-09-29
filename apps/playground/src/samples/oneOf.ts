import type { Sample } from './Sample';

const oneOf: Sample = {
  status: "broken",
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

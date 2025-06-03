import type { Sample } from '@/core/index.js';

export default {
  // NOTE: This sample produces warnings in the console as original project does.
  // Looks like `json-schema-merge-allof` package can't properly handle `if` and `then` in `allOf`.
  resolver: "compat",
  schema: {
    type: 'object',
    properties: {
      animal: {
        enum: ['Cat', 'Fish'],
      },
    },
    allOf: [
      {
        if: {
          properties: { animal: { const: 'Cat' } },
        },
        then: {
          properties: {
            food: { type: 'string', enum: ['meat', 'grass', 'fish'] },
          },
          required: ['food'],
        },
      },
      {
        if: {
          properties: { animal: { const: 'Fish' } },
        },
        then: {
          properties: {
            food: {
              type: 'string',
              enum: ['insect', 'worms'],
            },
            water: {
              type: 'string',
              enum: ['lake', 'sea'],
            },
          },
          required: ['food', 'water'],
        },
      },
      {
        required: ['animal'],
      },
    ],
  },
  uiSchema: {},
  initialValue: {},
} satisfies Sample;

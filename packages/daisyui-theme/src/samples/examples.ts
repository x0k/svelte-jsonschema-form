import type { Sample } from './Sample.js';

const examples: Sample = {
  status: "perfect",
  schema: {
    title: 'Examples',
    description: 'A text field with example values.',
    type: 'object',
    properties: {
      browser: {
        type: 'string',
        title: 'Browser',
        examples: ['Firefox', 'Chrome', 'Opera', 'Vivaldi', 'Safari'],
      },
    },
  },
  uiSchema: {},
  formData: {},
};

export default examples;

import type { Sample } from './Sample';

const examples: Sample = {
  status: "broken",
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

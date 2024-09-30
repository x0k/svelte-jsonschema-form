import type { Sample } from './Sample';

const single: Sample = {
  status: "perfect",
  schema: {
    title: 'A single-field form',
    type: 'string',
  },
  formData: 'initial value',
  uiSchema: {},
};

export default single;

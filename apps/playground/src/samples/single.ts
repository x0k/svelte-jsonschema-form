import type { Sample } from './Sample';

const single: Sample = {
  status: "broken",
  schema: {
    title: 'A single-field form',
    type: 'string',
  },
  formData: 'initial value',
  uiSchema: {},
};

export default single;

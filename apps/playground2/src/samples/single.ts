import type { Sample } from '@/shared/index.js';

export default {

  schema: {
    title: 'A single-field form',
    type: 'string',
  },
  formData: 'initial value',
  uiSchema: {},
} satisfies Sample;

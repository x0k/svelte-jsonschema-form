import type { Sample } from '@/core/index.js';

export default {

  schema: {
    title: 'A single-field form',
    type: 'string',
  },
  initialValue: 'initial value',
  uiSchema: {},
} satisfies Sample;

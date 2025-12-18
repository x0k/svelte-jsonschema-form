import type { SampleCategory, Sample } from "@/core/index.js";

export const category: SampleCategory = "Schema Basics";

export default {

  schema: {
    title: 'A single-field form',
    type: 'string',
  },
  initialValue: 'initial value',
  uiSchema: {},
} satisfies Sample;

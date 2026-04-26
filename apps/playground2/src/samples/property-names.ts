import type { SampleCategory, Sample } from "@/core/index.js";

export const category: SampleCategory = "Schema Basics";

export default {
  schema: {
    title: "Property names example",
    type: "object",
    additionalProperties: {
      type: "number",
    },
    propertyNames: {
      enum: ["foo", "bar", "baz"],
    },
  },
  uiSchema: {},
  initialValue: {
    foo: 123,
  },
} satisfies Sample;

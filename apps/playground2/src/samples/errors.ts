import type { Sample } from "@/core/index.js";

export default {
  resolver: "compat",
  schema: {
    title: "Contextualized errors",
    type: "object",
    properties: {
      firstName: {
        type: "string",
        title: "First name",
        minLength: 8,
        pattern: "\\d+",
      },
      active: {
        type: "boolean",
        title: "Active",
      },
      skills: {
        type: "array",
        items: {
          type: "string",
          minLength: 5,
        },
        minItems: 4,
      },
      multipleChoicesList: {
        type: "array",
        title: "Pick max two items",
        uniqueItems: true,
        maxItems: 2,
        items: {
          type: "string",
          enum: ["foo", "bar", "fuzz"],
        },
      },
    },
  },
  uiSchema: {},
  initialValue: {
    firstName: "Chuck",
    active: "wrong",
    skills: ["karate", "budo", "aikido"],
    multipleChoicesList: ["foo", "bar", "fuzz"],
  },
} satisfies Sample;

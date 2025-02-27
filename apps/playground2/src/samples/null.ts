import type { Sample } from "./Sample";

const nullField: Sample = {
  status: "perfect",
  schema: {
    title: "Null field example",
    description: "A short form with a null field",
    type: "object",
    required: ["firstName"],
    properties: {
      helpText: {
        title: "A null field",
        description:
          "Null fields like this are great for adding extra information",
        type: "null",
      },
      firstName: {
        type: "string",
        title: "A regular string field",
        default: "Chuck",
      },
    },
  },
  uiSchema: {
    firstName: {
      "ui:options": {
        text: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
  },
  formData: {},
};

export default nullField;

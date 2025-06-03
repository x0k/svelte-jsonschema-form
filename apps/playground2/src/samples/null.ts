import type { Sample } from "@/core/index.js";

export default {

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
        flowbite3Text: {
          autofocus: true,
        },
        shadcn4Text: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
  },
  initialValue: {},
} satisfies Sample;

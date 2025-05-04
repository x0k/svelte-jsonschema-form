import type { Sample } from "./Sample";

const patternProperties: Sample = {
  status: "perfect",
  schema: {
    title: "A customizable registration form",
    description: "A simple form with pattern properties example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
    },
    patternProperties: {
      "^[a-z][a-zA-Z0-9-]+$": {
        type: "string",
      },
    },
  },
  uiSchema: {
    "ui:options": {
      additionalPropertyKeyPrefix: "patternProperty"
    },
    firstName: {
      "ui:options": {
        text: {
          autofocus: true,
        },
        shadcnText: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
  },
  formData: {
    firstName: "Chuck",
    lastName: "Norris",
    assKickCount: "infinity",
  },
};

export default patternProperties;

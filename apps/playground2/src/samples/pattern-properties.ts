import type { Sample } from "@/core/index.js";

export default {
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
    additionalProperties: false,
    patternProperties: {
      "^[a-z][a-zA-Z0-9-]+$": {
        type: "string",
      },
    },
  },
  uiSchema: {
    "ui:options": {
      translations: {
        "add-object-property": "Add pattern property",
        "additional-property": "patternProperty",
      },
    },
    firstName: {
      "ui:options": {
        text: {
          autofocus: true,
        },
        shadcn4Text: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
  },
  initialValue: {
    firstName: "Chuck",
    lastName: "Norris",
    assKickCount: "infinity",
  },
} satisfies Sample;

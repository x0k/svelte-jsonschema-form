import { createPatternPropertyKeyValidator } from "@sjsf/form/validators/properties";

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
  customizeValidator: (v) =>
    Object.assign(
      v,
      createPatternPropertyKeyValidator(({ patternProperties }) => {
        const keys = Object.keys(patternProperties);
        return `Must match "${
          keys.length < 2 ? keys[0] : keys.join('" or "')
        }"`;
      })
    ),
};

export default patternProperties;

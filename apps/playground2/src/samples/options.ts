import type { Sample } from "./Sample";

const optionsSample: Sample = {
  status: "perfect",
  schema: {
    title: "A registration form",
    description: "A simple form example. Demonstrating ui options",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
        default: "Chuck",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  },
  uiSchema: {
    submitButton: {
      "ui:options": {
        title: "Confirm Details",
        button: {
          style:
            "width: 100%; background-color: lightgreen; border-radius: 8px; padding: 12px 0; margin: 0;",
        },
      },
    },
    firstName: {
      "ui:options": {
        stringEmptyValue: "",
        text: {
          autofocus: true,
          autocomplete: "family-name",
        },
      },
    },
    lastName: {
      "ui:options": {
        stringEmptyValue: "",
        title: "Surname",
        text: {
          autocomplete: "given-name",
        },
      },
    },
    telephone: {
      "ui:options": {
        text: {
          type: "tel",
        },
      },
    },
  },
  formData: {
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
  },
};

export default optionsSample;

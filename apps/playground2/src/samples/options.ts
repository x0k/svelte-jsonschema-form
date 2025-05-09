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
    "ui:options": {
      submitButtonText: "Register",
      submitButton: {
        style:
          "width: 100%; background-color: green; color: white; border-radius: 8px; padding: 12px 0; margin: 0;",
      },
    },
    firstName: {
      "ui:options": {
        stringEmptyValue: "",
        text: {
          autofocus: true,
          autocomplete: "family-name",
        },
        flowbite3Text: {
          autofocus: true,
          autocomplete: "family-name",
        },
        shadcnText: {
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
        flowbite3Text: {
          autocomplete: "given-name",
        },
        shadcnText: {
          autocomplete: "given-name",
        },
      },
    },
    telephone: {
      "ui:options": {
        text: {
          type: "tel",
        },
        flowbite3Text: {
          type: "tel",
        },
        shadcnText: {
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

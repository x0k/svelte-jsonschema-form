import type { Sample } from "./Sample";

const optionsSample: Sample = {
  status: "prefect",
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
        input: {
          style: "width: 100%;",
        },
      },
    },
    firstName: {
      "ui:options": {
        // 'ui:emptyValue': '',
        input: {
          autofocus: true,
          style: "width: 100%;",
          autocomplete: "family-name",
        },
      },
    },
    lastName: {
      "ui:options": {
        // "ui:emptyValue": "",
        title: "Surname",
        input: {
          autocomplete: "given-name",
        },
      },
    },
    telephone: {
      "ui:options": {
        input: {
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

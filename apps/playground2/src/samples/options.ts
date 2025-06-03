import type { Sample } from "@/core/index.js";

export default {

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
      translations: {
        submit: "Register",
      },
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
        shadcn4Text: {
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
        shadcn4Text: {
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
        shadcn4Text: {
          type: "tel",
        },
      },
    },
  },
  initialValue: {
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
  },
} satisfies Sample;

import type { Sample } from "./Sample";

import { MarkdownDescription } from "./components";

const simple: Sample = {
  status: "prefect",
  schema: {
    title: "A registration form",
    description: "A simple form example.",
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
      age: {
        type: "integer",
        title: "Age",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  },
  uiSchema: {
    firstName: {
      "ui:options": {
        autofocus: true,
        // emptyValue: "",
        placeholder:
          "ui:emptyValue causes this field to always be valid despite being required",
        autocomplete: "family-name",
        description:
          "Make text **bold** or *italic*. Take a look at other options [here](https://markdown-to-jsx.quantizor.dev/).",
      },
      "ui:components": {
        description: MarkdownDescription,
      },
    },
    lastName: {
      "ui:options": {
        autocomplete: "given-name",
        description:
          "Make things **bold** or *italic*. Embed snippets of `code`. <small>And this is a small texts.</small> ",
      },
      "ui:components": {
        description: MarkdownDescription,
      },
    },
    age: {
      "ui:options": {
        title: "Age of person",
        description: "(earth year)",
      },
    },
    bio: {
      "ui:widget": "textarea",
    },
    password: {
      "ui:options": {
        inputType: "password",
        help: "Hint: Make it strong!",
      },
    },
    telephone: {
      "ui:options": {
        inputType: "tel",
      },
    },
  },
  formData: {
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
    telephone: "1-800-KICKASS",
  },
};

export default simple;

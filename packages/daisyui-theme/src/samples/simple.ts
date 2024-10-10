import type { Sample } from "./Sample.js";

// import { MarkdownDescription } from "./components";

const simple: Sample = {
  status: "perfect",
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
        description:
          "Make text **bold** or *italic*. Take a look at other options [here](https://markdown-to-jsx.quantizor.dev/).",
        emptyValue: "",
        input: {
          autofocus: true,
          placeholder:
            "ui:emptyValue causes this field to always be valid despite being required",
          autocomplete: "family-name",
        },
      },
      "ui:components": {
        // description: MarkdownDescription,
      },
    },
    lastName: {
      "ui:options": {
        description:
          "Make things **bold** or *italic*. Embed snippets of `code`. <small>And this is a small texts.</small> ",
        input: {
          autocomplete: "given-name",
        },
      },
      "ui:components": {
        // description: MarkdownDescription,
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
        help: "Hint: Make it strong!",
        input: {
          type: "password",
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
    telephone: "1-800-KICKASS",
  },
};

export default simple;

import type { Sample } from "@/core/index.js";

export default {

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
        stringEmptyValue: "",
        text: {
          autofocus: true,
          placeholder:
            "`stringEmptyValue` causes this field to always be valid despite being required",
          autocomplete: "family-name",
        },
        flowbite3Text: {
          autofocus: true,
          placeholder:
            "`stringEmptyValue` causes this field to always be valid despite being required",
          autocomplete: "family-name",
        },
        shadcn4Text: {
          autofocus: true,
          placeholder:
            "`stringEmptyValue` causes this field to always be valid despite being required",
          autocomplete: "family-name",
        },
      },
      "ui:components": {
        description: "markdownDescription",
      },
    },
    lastName: {
      "ui:options": {
        description:
          "Make things **bold** or *italic*. Embed snippets of `code`.",
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
      "ui:components": {
        description: "markdownDescription",
      },
    },
    age: {
      "ui:options": {
        title: "Age of person",
        description: "(earth year)",
      },
    },
    bio: {
      "ui:components": {
        textWidget: "textareaWidget",
      },
    },
    password: {
      "ui:options": {
        help: "Hint: Make it strong!",
        text: {
          type: "password",
        },
        flowbite3Text: {
          type: "password",
        },
        shadcn4Text: {
          type: "password",
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
    telephone: "1-800-KICKASS",
  },
} satisfies Sample;

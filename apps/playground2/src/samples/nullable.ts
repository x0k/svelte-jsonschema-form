import type { Sample } from "./Sample";

const nullable: Sample = {
  status: "perfect",
  schema: {
    title: "A registration form (nullable)",
    description: "A simple form example using nullable types",
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
        type: ["integer", "null"],
        title: "Age",
      },
      bio: {
        type: ["string", "null"],
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
        text: {
          autofocus: true,
        },
        flowbite3Text: {
          autofocus: true,
        },
        shadcnText: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
    age: {
      "ui:options": {
        title: "Age of person",
        description: "(earthian year)",
        numberEmptyValue: null as unknown as undefined,
      },
    },
    bio: {
      "ui:components": {
        textWidget: "textareaWidget",
      },
      "ui:options": {
        textarea: {
          placeholder:
            "Leaving this field empty will cause formData property to be `null`",
        },
        flowbite3Textarea: {
          placeholder:
            "Leaving this field empty will cause formData property to be `null`",
        },
        stringEmptyValue: null as unknown as undefined,
      },
    },
    password: {
      "ui:options": {
        text: {
          type: "password",
        },
        flowbite3Text: {
          type: "password",
        },
        shadcnText: {
          type: "password",
        },
        description: "Hint: Make it strong!",
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
    bio: null,
    password: "noneed",
  },
};

export default nullable;

import type { Sample } from "@/core/index.js";

export default {

  schema: {
    title: "A registration form",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      password: {
        type: "string",
        title: "Password",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      firstName: {
        type: "string",
        title: "First name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
    },
  },
  uiSchema: {
    "ui:options": {
      order: ["firstName", "lastName", "*", "password"],
    },
    // age: {
    //   'ui:widget': 'updown',
    // },
    bio: {
      "ui:components": {
        textWidget: "textareaWidget",
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
        shadcn4Text: {
          type: "password",
        },
      },
    },
  },
  initialValue: {
    firstName: "Chuck",
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
  },
} satisfies Sample;

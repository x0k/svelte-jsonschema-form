import { SvelteMap } from "svelte/reactivity";
import { pathToId } from "@sjsf/form";

import type { Sample } from "./Sample";

const errorSchema: Sample = {
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
        text: {
          autofocus: true,
        },
        stringEmptyValue: "",
      },
    },
    age: {
      "ui:options": {
        title: "Age of person",
        description: "(earthian year)",
      },
    },
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
        help: "Hint: Make it strong!",
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
  errors: new SvelteMap([
    [
      pathToId(["firstName"]),
      [
        {
          instanceId: "root_firstName",
          propertyTitle: "firstName",
          message: "some error that got added as a prop",
          error: null,
        },
      ],
    ],
  ]),
};

export default errorSchema;

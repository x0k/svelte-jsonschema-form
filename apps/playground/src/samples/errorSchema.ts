import { SvelteMap } from "svelte/reactivity";

import type { Sample } from "./Sample";
import { DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR, pathToId } from '@sjsf/form';

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
        input: {
          autofocus: true,
        },
        emptyValue: "",
      },
    },
    age: {
      "ui:options": {
        title: "Age of person",
        description: "(earthian year)",
      },
    },
    bio: {
      "ui:widget": "textarea",
    },
    password: {
      "ui:options": {
        input: {
          type: "password",
        },
        help: "Hint: Make it strong!",
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
  errors: new SvelteMap([
    [
      pathToId(DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR, ["firstName"]),
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

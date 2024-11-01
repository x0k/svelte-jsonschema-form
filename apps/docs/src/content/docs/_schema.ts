import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const schema: Schema = {
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
    star: {
      type: "boolean",
      title: "Star",
    },
  },
};

export const uiSchema: UiSchemaRoot = {
  firstName: {
    "ui:options": {
      input: {
        autocomplete: "family-name",
      },
    },
  },
  lastName: {
    "ui:options": {
      input: {
        autocomplete: "given-name",
      },
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
  star: {
    "ui:options": {
      title: "Does this library deserve a star?",
    },
  },
};

export const initialValue = {
  lastName: "Norris",
  age: 75,
  bio: "Roundhouse kicking asses since 1940",
  password: "noneed",
  telephone: "1-800-KICKASS",
};

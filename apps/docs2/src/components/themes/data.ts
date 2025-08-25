import type { Schema, UiSchemaRoot } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

export const schema = {
  title: "User Registration",
  description: "Simple user registration form",
  type: "object",
  required: ["name", "email", "age"],
  properties: {
    name: {
      type: "string",
      title: "Full Name",
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: "string",
      title: "Email",
      format: "email",
    },
    age: {
      type: "integer",
      title: "Age",
      minimum: 13,
      maximum: 120,
    },
    country: {
      type: "string",
      title: "Country",
      enum: ["US", "CA", "UK", "DE", "FR"],
    },
    skills: {
      type: "array",
      title: "Skills",
      items: {
        type: "string",
        enum: ["HTML", "CSS", "JS/TS", "Svelte"],
      },
      uniqueItems: true,
      maxItems: 3,
    },
    bio: {
      type: "string",
      title: "About You",
      maxLength: 200,
    },
  },
} as const satisfies Schema;

export type FormValue = FromSchema<typeof schema>;

export const uiSchema: UiSchemaRoot = {
  "ui:options": {
    layouts: {
      "object-properties": {
        style:
          "display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;",
      },
    },
    translations: {
      submit: "Register",
    },
  },
  name: {
    "ui:options": {
      text: {
        autocomplete: "name",
      },
      flowbiteText: {
        autocomplete: "name",
      },
    },
  },
  email: {
    "ui:options": {
      text: {
        type: "email",
      },
      flowbiteText: {
        type: "email",
      },
    },
  },
  country: {
    "ui:components": {
      stringField: "enumField",
    },
    "ui:options": {
      enumNames: [
        "United States",
        "Canada",
        "United Kingdom",
        "Germany",
        "France",
      ],
    },
  },
  skills: {
    "ui:components": {
      arrayField: "multiEnumField",
    },
    "ui:options": {
      layouts: {
        "field-content": {
          style: "display: flex; gap: 0.5rem;",
        },
      },
    },
  },
  bio: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
  },
};

export const initialValue: FormValue = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  age: 28,
  country: "CA",
  skills: ["Svelte"],
  bio: "Passionate Svelte developer",
};

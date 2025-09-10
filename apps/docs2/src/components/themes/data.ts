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
    experience: {
      type: "string",
      title: "Work Experience",
      enum: ["beginner", "intermediate", "advanced"],
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
    startDate: {
      type: "string",
      title: "Available Start Date",
      format: "date",
    },
    resume: {
      type: "string",
      title: "Upload Resume",
      format: "data-url",
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
      flowbite3Text: {
        autocomplete: "name",
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
          style: "display: flex; flex-wrap: wrap; gap: 0.5rem;",
        },
      },
    },
  },
  bio: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
    "ui:options": {
      layouts: {
        "object-property": {
          style: "grid-row: span 2;",
        },
      },
      textarea: {
        rows: 5,
      },
      flowbite3Textarea: {
        rows: 5,
      },
    },
  },
  experience: {
    "ui:components": {
      stringField: "enumField",
      selectWidget: "radioWidget",
    },
    "ui:options": {
      layouts: {
        "field-content": {
          style: "display: flex; flex-wrap: wrap; gap: 0.5rem;",
        },
      },
      shadcn4RadioGroup: {
        style: "grid-auto-flow: column; grid-auto-columns: max-content;",
      },
      enumNames: ["0-2 years", "3-7 years", "8+ years"],
    },
  },
  startDate: {
    "ui:components": {
      textWidget: "datePickerWidget",
    },
  },
  resume: {
    "ui:components": {
      stringField: "fileField",
    },
  },
};

export const initialValue: FormValue = {
  name: "Sarah Johnson",
  email: "sarah.johnson@invalid",
  age: 28,
  country: "CA",
  skills: ["Svelte"],
  experience: "intermediate",
  startDate: new Date().toLocaleDateString("en-CA"),
  bio: "Bio",
};

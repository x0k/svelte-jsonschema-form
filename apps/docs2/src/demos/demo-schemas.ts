import type { Schema } from "@sjsf/form";

export const objectSchema: Schema = {
  type: "object",
  title: "My form",
  properties: {
    bool: {
      title: "bool (true)",
      type: "boolean",
      const: true,
    },
    number: {
      title: "number (min 1000)",
      type: "number",
      minimum: 1000,
    },
    text: {
      title: "text (min length 5)",
      type: "string",
      minLength: 5,
    },
  },
  required: ["number", "text"],
};

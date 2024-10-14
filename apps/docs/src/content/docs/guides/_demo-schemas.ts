import type { Schema } from "@sjsf/form";

export const objectSchema: Schema = {
  type: "object",
  title: "My form",
  properties: {
    number: {
      type: "number",
      minimum: 5,
    },
    select: {
      type: "string",
      enum: ["one", "two", "three"],
    },
    text: {
      type: "string",
      minLength: 5,
    },
  },
  required: ["number", "text", "select"],
};

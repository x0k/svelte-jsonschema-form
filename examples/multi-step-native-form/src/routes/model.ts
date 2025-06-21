import type { Schema } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

export const steps = ["first", "second"] as const;

export const schema = {
  type: "object",
  properties: {
    step: {
      type: "string",
      enum: Array.from(steps),
    },
    first: {
      type: "object",
      properties: {
        name: {
          type: "string",
          title: "Name",
          minLength: 1,
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
    second: {
      type: "object",
      properties: {
        email: {
          type: "string",
          title: "Email",
          format: "email",
        },
      },
      required: ["email"],
      additionalProperties: false,
    },
  },
  required: ["step"],
  dependencies: {
    step: {
      oneOf: steps.map((step, i) => ({
        properties: {
          step: {
            const: step,
          },
        },
        required: steps.slice(0, i + 1),
      })),
    },
  },
  additionalProperties: false,
} as const satisfies Schema;

export type Value = FromSchema<typeof schema>;

export type CompletedValue = Required<Value>;

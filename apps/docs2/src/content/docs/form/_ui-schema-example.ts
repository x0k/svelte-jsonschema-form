import type { Schema, UiSchemaRoot } from "@sjsf/form";

const schema: Schema = {
  oneOf: [
    {
      properties: {
        foo: {
          type: "string",
        },
      },
    },
    {
      properties: {
        bar: {
          type: "number",
        },
      },
    },
  ],
};

const uiSchema: UiSchemaRoot = {
  foo: {
    // ui schema for `foo` field
  },
  bar: {
    // ui schema for `bar` field
  },
};

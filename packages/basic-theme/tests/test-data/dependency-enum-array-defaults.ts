import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const checkboxDepsSchema = {
  type: "object",
  properties: {
    opt: {
      type: "boolean",
    },
  },
  dependencies: {
    opt: {
      oneOf: [
        {
          properties: {
            opt: {
              const: true,
            },
            arr: {
              type: "array",
              uniqueItems: true,
              items: {
                type: "string",
                enum: ["a", "b"],
              },
            },
          },
        },
        {
          properties: {
            opt: {
              const: false,
            },
            arr: {
              type: "array",
              uniqueItems: true,
              items: {
                type: "string",
                enum: ["c", "d"],
              },
            },
          },
        },
      ],
    },
  },
} as const satisfies Schema;

export const checkboxDepsUiSchema = {
  arr: {
    "ui:components": {
      arrayField: "multiEnumField",
    },
  },
} satisfies UiSchemaRoot;

export const selectDepsSchema = {
  title: "Dependencies & Default",
  type: "object",
  properties: {
    select_item: {
      type: "string",
      enum: ["item1", "item2"],
    },
  },
  dependencies: {
    select_item: {
      oneOf: [
        {
          properties: {
            select_item: {
              const: "item1",
            },
            item_detail: {
              type: "array",
              items: {
                type: "string",
                enum: ["item_detail1", "item_detail2"],
              },
              default: ["item_detail1", "item_detail2"],
            },
          },
        },
        {
          properties: {
            select_item: {
              const: "item2",
            },
            item_detail: {
              type: "array",
              items: {
                type: "string",
                enum: ["item_detail3", "item_detail4"],
              },
              default: ["item_detail3", "item_detail4"],
            },
          },
        },
      ],
    },
  },
} as const satisfies Schema;

export const selectDepsUiSchema = {
  select_item: {
    "ui:components": {
      stringField: "enumField",
    },
  },
} satisfies UiSchemaRoot;

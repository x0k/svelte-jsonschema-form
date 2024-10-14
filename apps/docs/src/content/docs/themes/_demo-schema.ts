import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const schema: Schema = {
  type: "object",
  title: "Demo schema",
  properties: {
    checkbox: {
      type: "boolean",
    },
    number: {
      type: "number",
      minimum: 5,
    },
    range: {
      type: "integer",
    },
    text: {
      type: "string",
    },
    textarea: {
      type: "string",
    },
    file: {
      type: "string",
      format: "data-url",
    },
    select: {
      type: "string",
      enum: ["one", "two", "three"],
    },
    multiSelect: {
      type: "array",
      items: {
        type: "string",
        enum: ["one", "two", "three"],
      },
      uniqueItems: true,
    },
    radio: {
      type: "string",
      enum: ["one", "two", "three"],
    },
    checkboxes: {
      type: "array",
      items: {
        type: "string",
        enum: ["one", "two", "three"],
      },
      uniqueItems: true,
    },
    array: {
      type: "array",
      items: {
        type: "string",
      },
    }
  },
  additionalProperties: {
    type: "integer",
  }
};

export const uiSchema: UiSchemaRoot = {
  range: {
    "ui:options": {
      "input": {
        type: "range",
      }
    }
  },
  textarea: {
    "ui:widget": "textarea",
  },
  radio: {
    "ui:widget": "radio",
  },
  checkboxes: {
    "ui:widget": "checkboxes",
  }
}

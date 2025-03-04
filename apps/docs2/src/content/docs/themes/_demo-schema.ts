import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const boolean: Schema = {
  type: "boolean",
};

export const arrayOfUniqueItems: Schema = {
  type: "array",
  items: {
    type: "string",
    enum: ["one", "two", "three"],
  },
  uniqueItems: true,
};

export const string: Schema = {
  type: "string",
};

export const schema: Schema = {
  type: "object",
  title: "Demo schema",
  properties: {
    checkbox: boolean,
    number: {
      type: "number",
      minimum: 5,
    },
    range: {
      type: "integer",
    },
    text: string,
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
    multiSelect: arrayOfUniqueItems,
    radio: {
      type: "string",
      enum: ["one", "two", "three"],
    },
    checkboxes: arrayOfUniqueItems,
    array: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  additionalProperties: {
    type: "integer",
  },
};

export const uiSchema: UiSchemaRoot = {
  range: {
    "ui:options": {
      input: {
        type: "range",
      },
    },
  },
  textarea: {
    "ui:widget": "textarea",
  },
  radio: {
    "ui:widget": "radio",
  },
  checkboxes: {
    "ui:widget": "checkboxes",
  },
};

import { SvelteMap } from "svelte/reactivity";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  pathToId,
  type Schema,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";

export const states = (schema: Schema): Schema => ({
  type: "object",
  properties: {
    default: schema,
    readonly: schema,
    disabled: schema,
    error: schema,
  },
});

export const boolean: Schema = {
  type: "boolean",
};

export const enumeration: Schema = {
  type: "string",
  enum: ["foo", "bar", "fuzz", "qux"],
};

export const uniqueArray: Schema = {
  type: "array",
  items: enumeration,
  uniqueItems: true,
};

export const file: Schema = {
  type: "string",
  format: "data-url",
};

export const number: Schema = {
  type: "number",
};

export const text: Schema = {
  type: "string",
};

export const schema: Schema = {
  type: "object",
  properties: {
    checkbox: states(boolean),
    checkboxes: states(uniqueArray),
    file: states(file),
    multiFile: states({
      type: "array",
      items: file,
    }),
    number: states(number),
    range: states(number),
    radio: states(enumeration),
    select: states(enumeration),
    multiSelect: states(uniqueArray),
    text: states(text),
    textarea: states(text),
    date: states(text),
  },
};

export const uiStates = (uiSchema: UiSchema): UiSchema => ({
  default: {
    ...uiSchema,
    "ui:options": {
      ...uiSchema["ui:options"],
      input: {
        ...uiSchema["ui:options"]?.input,
        placeholder: "placeholder",
      },
    },
  },
  readonly: {
    ...uiSchema,
    "ui:options": {
      input: {
        ...uiSchema["ui:options"]?.input,
        readonly: true,
      },
    },
  },
  disabled: {
    ...uiSchema,
    "ui:options": {
      ...uiSchema["ui:options"],
      input: {
        ...uiSchema["ui:options"]?.input,
        disabled: true,
      },
    },
  },
  error: uiSchema,
});

export const uiSchema: UiSchemaRoot = {
  checkbox: uiStates({}),
  checkboxes: uiStates({
    "ui:widget": "checkboxes",
  }),
  file: uiStates({}),
  multiFile: uiStates({}),
  number: uiStates({}),
  range: uiStates({
    "ui:options": {
      input: {
        type: "range",
      },
    },
  }),
  radio: uiStates({
    "ui:widget": "radio",
  }),
  select: uiStates({}),
  multiSelect: uiStates({}),
  text: uiStates({}),
  textarea: uiStates({
    "ui:widget": "textarea",
  }),
  date: uiStates({
    "ui:options": {
      input: {
        type: "date",
      },
    },
  }),
};

export const errors = [
  "checkbox",
  "checkboxes",
  "file",
  "multiFile",
  "number",
  "range",
  "radio",
  "select",
  "multiSelect",
  "text",
  "textarea",
].map(
  (key) =>
    ({
      error: null,
      instanceId: pathToId(DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR, [
        key,
        "error",
      ]),
      propertyTitle: "error",
      message: `${key} error`,
    } satisfies ValidationError<null>)
);

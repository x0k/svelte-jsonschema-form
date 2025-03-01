import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  pathToId,
  type Schema,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";

const states = (schema: Schema): Schema => ({
  type: "object",
  properties: {
    default: schema,
    readonly: {
      ...schema,
      readOnly: true,
    },
    error: schema,
  },
});

const boolean: Schema = {
  type: "boolean",
};

const enumeration: Schema = {
  type: "string",
  enum: ["foo", "bar", "fuzz", "qux"],
};

const uniqueArray: Schema = {
  type: "array",
  items: enumeration,
  uniqueItems: true,
};

const file: Schema = {
  type: "string",
  format: "data-url",
};

const number: Schema = {
  type: "number",
};

const text: Schema = {
  type: "string",
};

export const schema: Schema = {
  type: "object",
  properties: {
    checkbox: states(boolean),
    switch: states(boolean),
    checkboxes: states(uniqueArray),
    file: states(file),
    multiFile: states({
      type: "array",
      items: file,
    }),
    number: states(number),
    range: states(number),
    radio: states(enumeration),
    radioButtons: states(enumeration),
    select: states(enumeration),
    multiSelect: states(uniqueArray),
    text: states(text),
    textarea: states(text),
    date: states(text),
  },
};

const uiStates = (uiSchema: UiSchema): UiSchema => ({
  default: uiSchema,
  readonly: uiSchema,
  error: uiSchema,
});

export const uiSchema: UiSchemaRoot = {
  checkbox: uiStates({}),
  switch: uiStates({
    "ui:components": {
      checkboxWidget: "switchWidget",
    },
  }),
  checkboxes: uiStates({}),
  file: uiStates({}),
  multiFile: uiStates({}),
  number: uiStates({}),
  range: uiStates({
    "ui:components": {
      numberWidget: "rangeWidget",
    },
  }),
  radio: uiStates({
    "ui:components": {
      selectWidget: "radioWidget",
    },
  }),
  radioButtons: uiStates({
    "ui:components": {
      selectWidget: "radioButtonsWidget",
    },
  }),
  select: uiStates({}),
  multiSelect: uiStates({
    "ui:components": {
      checkboxesWidget: "multiSelectWidget",
    },
  }),
  text: uiStates({}),
  textarea: uiStates({
    "ui:components": {
      textWidget: "textareaWidget",
    },
  }),
  date: uiStates({
    "ui:components": {
      textWidget: "datePickerWidget",
    },
  }),
};

const createErrors = (keys: string[]) =>
  keys.map(
    (key) =>
      ({
        error: null,
        instanceId: pathToId(DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR, [
          key,
          "error",
        ]),
        propertyTitle: "error",
        message: `${key} error`,
      }) satisfies ValidationError<null>
  );

export const errors = createErrors(Object.keys(uiSchema));

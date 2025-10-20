import "@sjsf/form/fields/extra/array-files-include";
import "@sjsf/form/fields/extra/enum-include";
import "@sjsf/form/fields/extra/multi-enum-include";
import "@sjsf/form/fields/extra/file-include";
import "@sjsf/form/fields/extra/files-include";

import {
  boolean,
  enumeration,
  file,
  filesArray,
  number,
  text,
  uniqueArray,
  type Specs,
} from "../lib/schemas.js";

export const DEFAULT_SPECS: Specs = {
  checkbox: [
    boolean,
    {},
    {
      oninput: "inputCheckbox",
      onchange: "changeCheckbox",
      onblur: "visitCheckbox",
    },
  ],
  checkboxes: [
    uniqueArray,
    {
      "ui:components": {
        arrayField: "multiEnumField",
      },
    },
    {
      oninput: "inputCheckbox",
      onchange: "changeCheckbox",
      onblur: "visitCheckbox",
    },
  ],
  file: [
    file,
    {
      "ui:components": {
        stringField: "fileField",
      },
    },
    {
      onchange: "changeFile",
      onblur: "visitFile",
    },
  ],
  multiFile: [
    filesArray,
    {
      "ui:components": {
        arrayField: "arrayFilesField",
      },
    },
    {
      onchange: "changeFile",
      onblur: "visitFile",
    },
  ],
  number: [
    number,
    {},
    {
      oninput: "inputNumber",
      onchange: "changeNumber",
      onblur: "visitNumber",
    },
  ],
  select: [
    enumeration,
    {
      "ui:components": {
        stringField: "enumField",
      },
    },
    {
      oninput: "inputSelect",
      onchange: "changeSelect",
      onblur: "visitSelect",
    },
  ],
  text: [
    text,
    {},
    {
      oninput: "inputText",
      onchange: "changeText",
      onblur: "visitText",
    },
  ],
};

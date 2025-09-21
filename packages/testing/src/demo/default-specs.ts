import { cast } from "@sjsf/form/lib/component";
import type { ComponentDefinition } from "@sjsf/form";
import FilesField from "@sjsf/form/fields/extra-fields/files.svelte";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import "@sjsf/form/fields/extra-fields/files-include";

import {
  assertStrings,
  boolean,
  enumeration,
  file,
  filesArray,
  number,
  text,
  uniqueArray,
  type Specs,
} from "./schemas.js";
import {
  changeCheckbox,
  changeFile,
  changeNumber,
  changeSelect,
  changeText,
  inputCheckbox,
  inputNumber,
  inputSelect,
  inputText,
  visitCheckbox,
  visitFile,
  visitNumber,
  visitSelect,
  visitText,
} from "./triggers.js";

const filesAsArrayField = cast(FilesField, {
  value: {
    transform(props) {
      assertStrings(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;

export const DEFAULT_SPECS: Specs = {
  checkbox: [
    boolean,
    {},
    {
      oninput: inputCheckbox,
      onchange: changeCheckbox,
      onblur: visitCheckbox,
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
      oninput: inputCheckbox,
      onchange: changeCheckbox,
      onblur: visitCheckbox,
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
      onchange: changeFile,
      onblur: visitFile,
    },
  ],
  multiFile: [
    filesArray,
    {
      "ui:components": {
        arrayField: filesAsArrayField,
      },
    },
    {
      onchange: changeFile,
      onblur: visitFile,
    },
  ],
  number: [
    number,
    {},
    {
      oninput: inputNumber,
      onchange: changeNumber,
      onblur: visitNumber,
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
      oninput: inputSelect,
      onchange: changeSelect,
      onblur: visitSelect,
    },
  ],
  text: [
    text,
    {},
    {
      oninput: inputText,
      onchange: changeText,
      onblur: visitText,
    },
  ],
};

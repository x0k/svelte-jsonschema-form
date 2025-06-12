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
} from "./schemas";

const filesAsArrayField = cast(FilesField, {
  value: {
    transform(props) {
      assertStrings(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;

export const DEFAULT_SPECS: Specs = {
  checkbox: [boolean, {}],
  checkboxes: [
    uniqueArray,
    {
      "ui:components": {
        arrayField: "multiEnumField",
      },
    },
  ],
  file: [
    file,
    {
      "ui:components": {
        stringField: "fileField",
      },
    },
  ],
  multiFile: [
    filesArray,
    {
      "ui:components": {
        arrayField: filesAsArrayField,
      },
    },
  ],
  number: [number, {}],
  select: [
    enumeration,
    {
      "ui:components": {
        stringField: "enumField",
      },
    },
  ],
  text: [text, {}],
};

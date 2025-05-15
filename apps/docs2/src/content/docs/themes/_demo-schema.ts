import { cast } from "@sjsf/form/lib/component";
import type { ComponentDefinition, Schema, UiSchema } from "@sjsf/form";
import FilesField from "@sjsf/form/fields/extra-fields/files.svelte";
import { s } from "testing/demo";

const filesAsArrayField = cast(FilesField, {
  value: {
    transform(props) {
      s.assertStrings(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;

export function createSchemas(specs: Record<string, [Schema, UiSchema]> = {}) {
  return s.createSchemas({
    checkbox: [s.boolean, {}],
    checkboxes: [
      s.uniqueArray,
      {
        "ui:components": {
          arrayField: "multiEnumField",
        },
      },
    ],
    file: [
      s.file,
      {
        "ui:components": {
          stringField: "fileField",
        },
      },
    ],
    multiFile: [
      {
        type: "array",
        items: s.file,
      },
      {
        "ui:components": {
          arrayField: filesAsArrayField,
        },
      },
    ],
    number: [s.number, {}],
    select: [
      s.enumeration,
      {
        "ui:components": {
          stringField: "enumField",
        },
      },
    ],
    text: [s.text, {}],
    ...specs,
  });
}

export function replacer(key: string, value: any) {
  if (typeof value === "function") {
    return `<function: ${value.name || "anonymous"}>`;
  }
  return value;
}

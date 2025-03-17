import type { Schema, UiSchema } from "@sjsf/form";
import { s } from "testing/demo";

export function createSchemas(specs: Record<string, [Schema, UiSchema]> = {}) {
  return s.createSchemas({
    checkbox: [s.boolean, {}],
    checkboxes: [s.uniqueArray, {}],
    file: [s.file, {}],
    multiFile: [
      {
        type: "array",
        items: s.file,
      },
      {},
    ],
    number: [s.number, {}],
    select: [s.enumeration, {}],
    text: [s.text, {}],
    ...specs,
  });
}

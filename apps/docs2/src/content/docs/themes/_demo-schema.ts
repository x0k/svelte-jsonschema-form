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
export function replacer(key: string, value: any) {
  if (typeof value === "function") {
    return `<function: ${value.name || "anonymous"}>`;
  }
  return value;
}

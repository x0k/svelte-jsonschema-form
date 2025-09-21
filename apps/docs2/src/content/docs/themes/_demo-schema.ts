import { s } from "testing/demo";

import { THEME_PACKAGES, type Theme } from "@/shared";

const WIDGET_USED_AS_DEFAULT_IN_FIELDS: Record<string, string[] | undefined> = {
  checkboxes: ["multiEnumField"],
  file: ["fileField", "filesField"],
  tags: ["tagsField"],
};

export function createExtraImports(theme: Theme, widgets: string[]) {
  return widgets
    .map((w) => {
      const line = `import "${THEME_PACKAGES[theme]}/extra-widgets/${w}-include"`;
      const fields = WIDGET_USED_AS_DEFAULT_IN_FIELDS[w];
      return fields
        ? `// Used by default in the following fields: ${fields.join(
            ", "
          )}\n${line}`
        : line;
    })
    .join("\n");
}

export function createSchemas(specs: s.Specs = {}) {
  return s.createSchemas(specs);
}

export function replacer(_: string, value: any) {
  if (typeof value === "function") {
    return `<function: ${value.name || "anonymous"}>`;
  }
  return value;
}

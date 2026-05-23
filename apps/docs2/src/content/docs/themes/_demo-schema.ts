import type { UiSchema } from "@sjsf/form";
import { transpose } from "@json-table/core/lib/matrix";
import { createMatrix, fromMatrix } from "@json-table/core/block-matrix";
import { makeBlockFactory } from "@json-table/core/json-to-table";
import { blockToHTML } from "@json-table/core/block-to-html";
import {
  themeExtraWidgetSubPath,
  type ExtraWidgetFileNames,
  type Theme,
} from "meta";

import { s } from "theme-testing/specs";

const WIDGET_USED_AS_DEFAULT_IN_FIELDS: Record<string, string[] | undefined> = {
  checkboxes: ["multiEnumField"],
  file: ["fileField", "filesField"],
  tags: ["tagsField"],
};

export function createExtraImports<T extends Theme>(
  theme: T,
  widgets: ExtraWidgetFileNames[T][]
) {
  return widgets
    .map((w) => {
      const line = `import "${themeExtraWidgetSubPath(theme, w, true)}"`;
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
  const clone: s.Specs = {};
  for (const [k, v] of Object.entries(specs)) {
    clone[k] = v.with(1, {
      ...v[1],
      "ui:options": {
        ...v[1]["ui:options"],
        title: k,
      },
    }) as typeof v;
  }
  const schemas = s.createSchemas(clone);
  const ui = schemas.uiSchema as UiSchema;
  for (const key of Object.keys(ui)) {
    ui[key] = {
      ...ui[key],
      "ui:options": {
        ...(ui[key] as UiSchema)?.["ui:options"],
        layouts: {
          "object-properties": {
            style:
              "display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;",
          },
        },
      },
    };
  }
  return schemas;
}

const createBlock = makeBlockFactory({
  cornerCellValue: "№",
  joinPrimitiveArrayValues: true,
});

export function validationEvents(specs: s.Specs) {
  const data = Object.fromEntries(
    Object.entries(specs).map(([k, [, , e]]) => [
      k,
      Object.keys(e).join(", ") ?? "none",
    ])
  );
  let block = createBlock(data);
  let matrix = createMatrix(block, ({ type, value }) => ({ type, value }));
  matrix = transpose(matrix);
  block = fromMatrix(
    matrix,
    ({ type }) => type,
    ({ value }) => value
  );
  return blockToHTML(block);
}

export function replacer(_: string, value: any) {
  if (typeof value === "function") {
    return `<function: ${value.name || "anonymous"}>`;
  }
  return value;
}

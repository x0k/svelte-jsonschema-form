// This file is a separate entry point (see tsdown.config.js) so that
import type { AstTypes } from "@sveltejs/sv-utils";

// the addon's utilities are published as their own module on npm.
export * from "@sveltejs/sv-utils";

export function createReExport(
  node: AstTypes.Program,
  options: { name: string; source: string; imported?: string },
): AstTypes.ExportNamedDeclaration {
  const localName = options.imported ?? options.name;

  const namedExports = node.body.filter(
    (item) => item.type === "ExportNamedDeclaration",
  ) as AstTypes.ExportNamedDeclaration[];

  let namedExport = namedExports.find((exportNode) => {
    if (!exportNode.source) return false;

    return exportNode.specifiers.some((s) => {
      return (
        s.type === "ExportSpecifier" &&
        s.exported.type === "Identifier" &&
        s.exported.name === options.name
      );
    });
  });

  if (namedExport) return namedExport;

  namedExport = {
    type: "ExportNamedDeclaration",
    declaration: null,
    specifiers: [
      {
        type: "ExportSpecifier",
        local: {
          type: "Identifier",
          name: localName,
        },
        exported: {
          type: "Identifier",
          name: options.name,
        },
      },
    ],
    source: {
      type: "Literal",
      value: options.source,
    },
    attributes: [],
  };

  node.body.push(namedExport);
  return namedExport;
}

// This file is a separate entry point (see tsdown.config.js) so that
import type { AstTypes } from "@sveltejs/sv-utils";

// the addon's utilities are published as their own module on npm.
export * from "@sveltejs/sv-utils";

export function createReExport(
  node: AstTypes.Program,
  options: { name: string; source: string; imported?: string },
): AstTypes.ExportNamedDeclaration {
  const localName = options.imported ?? options.name;

  let namedExport = node.body.find(
    (item): item is AstTypes.ExportNamedDeclaration => {
      if (item.type !== "ExportNamedDeclaration" || !item.source) {
        return false;
      }
      return item.specifiers.some((s) => {
        return (
          s.type === "ExportSpecifier" &&
          s.exported.type === "Identifier" &&
          s.exported.name === options.name
        );
      });
    },
  );

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

export function getTopLevelFunction(node: AstTypes.Program, name: string) {
  return node.body.find(
    (
      item,
    ): item is AstTypes.FunctionDeclaration | AstTypes.VariableDeclaration =>
      item.type === "FunctionDeclaration"
        ? item.id.name === name
        : item.type === "VariableDeclaration" &&
          item.declarations.some((decl) => {
            if (decl.id.type !== "Identifier") return false;
            if (decl.id.name !== name) return false;

            const init = decl.init;
            if (!init) return false;

            return (
              init.type === "ArrowFunctionExpression" ||
              init.type === "FunctionExpression"
            );
          }),
  );
}

// This file is a separate entry point (see tsdown.config.js) so that
import { transforms, type AstTypes, type SvelteAst } from "@sveltejs/sv-utils";

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

// https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv/src/addons/common.ts#L95
export function addToDemoPage(path: string, language: "ts" | "js") {
  return transforms.svelteScript({ language }, ({ ast, js, svelte }) => {
    for (const node of ast.fragment.nodes) {
      if (node.type === "RegularElement") {
        const hrefAttribute = node.attributes.find(
          (x) => x.type === "Attribute" && x.name === "href",
        ) as SvelteAst.Attribute;
        if (!hrefAttribute || !hrefAttribute.value) continue;

        if (!Array.isArray(hrefAttribute.value)) continue;

        const hasDemo = hrefAttribute.value.some(
          // we use includes as it could be "/demo/${path}" or "resolve("demo/${path}")" or "resolve('demo/${path}')"
          (x) => x.type === "Text" && x.data.includes(`/demo/${path}`),
        );
        if (hasDemo) {
          return false;
        }
      }
    }

    js.imports.addNamed(ast.instance.content, {
      imports: ["resolve"],
      from: "$app/paths",
    });

    svelte.addFragment(ast, `<a href={resolve('/demo/${path}')}>${path}</a>`, {
      mode: "prepend",
    });
  });
}

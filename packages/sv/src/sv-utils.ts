// This file is a separate entry point (see tsdown.config.js) so that
import { transforms, type AstTypes, type SvelteAst } from "@sveltejs/sv-utils";

// the addon's utilities are published as their own module on npm.
export * from "@sveltejs/sv-utils";

export interface NamedImportOptions {
  /**
   * ```ts
   * imports: { 'name': 'alias' } | ['name']
   * ```
   */
  imports: Record<string, string> | string[];
  from: string;
  isType?: boolean;
}

export interface NamespaceImportOptions {
  from: string;
  as: string;
}

export function renderImport(
  options: NamedImportOptions | NamespaceImportOptions,
) {
  if ("as" in options) {
    return `import * as ${options.as} from "${options.from}"`;
  }
  return `import ${options.isType ? "type " : ""}{ ${(Array.isArray(options.imports) ? options.imports : Object.entries(options.imports).map(([k, v]) => `${k} as ${v}`)).join(", ")} } from "${options.from}"`;
}

export function renderImports(
  imports: (NamedImportOptions | NamespaceImportOptions)[],
  separator = ";\n",
) {
  return imports.map(renderImport).join(separator);
}

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
    ): item is
      | AstTypes.FunctionDeclaration
      | AstTypes.VariableDeclaration
      | AstTypes.ExportNamedDeclaration => {
      const decl =
        item.type === "ExportNamedDeclaration" && item.declaration
          ? item.declaration
          : item;

      if (decl.type === "FunctionDeclaration") {
        return decl.id.name === name;
      }
      if (decl.type === "VariableDeclaration") {
        return decl.declarations.some((decl) => {
          if (decl.id.type !== "Identifier") return false;
          if (decl.id.name !== name) return false;

          const init = decl.init;
          if (!init) return false;

          return (
            init.type === "ArrowFunctionExpression" ||
            init.type === "FunctionExpression"
          );
        });
      }
      return false;
    },
  );
}

// https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv/src/addons/common.ts#L95
export function addToDemoPage(path: string, language: "ts" | "js") {
  return transforms.svelteScript({ language }, ({ ast, svelte, js }) => {
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

export function jsCreateAsConst(
  node: AstTypes.Expression,
): AstTypes.TSAsExpression {
  return {
    type: "TSAsExpression",
    expression: node,
    typeAnnotation: {
      type: "TSTypeReference",
      typeName: {
        type: "Identifier",
        name: "const",
      },
    },
  };
}

// https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv-utils/src/tooling/css/index.ts#L3
export function cssAddPseudoRule(
  node: SvelteAst.CSS.StyleSheetBase,
  options: { selector: string },
): SvelteAst.CSS.Rule {
  const selectorName = options.selector;

  const rules = node.children.filter((x) => x.type === "Rule");
  let rule = rules.find((x) => {
    const selector = x.prelude.children[0]!.children[0]!.selectors[0]!;
    return (
      selector.type === "PseudoClassSelector" && selector.name === selectorName
    );
  });

  if (!rule) {
    rule = {
      type: "Rule",
      prelude: {
        type: "SelectorList",
        children: [
          {
            type: "ComplexSelector",
            children: [
              {
                type: "RelativeSelector",
                selectors: [
                  {
                    type: "PseudoClassSelector",
                    name: selectorName,
                    args: null,
                    start: 0,
                    end: 0,
                  },
                ],
                combinator: null,
                start: 0,
                end: 0,
              },
            ],
            start: 0,
            end: 0,
          },
        ],
        start: 0,
        end: 0,
      },
      block: { type: "Block", children: [], start: 0, end: 0 },
      start: 0,
      end: 0,
    };
    node.children.push(rule);
  }

  return rule;
}

const nodeBase = {
  name_loc: { start: { column: 0, line: 0 }, end: { column: 0, line: 0 } },
  start: 0,
  end: 0,
};

export function svelteWrapFragment(
  ast: SvelteAst.Root,
  options: {
    wrapper: string;
    attributes?: Array<SvelteAst.Attribute>;
  },
): void {
  const svelteHeadIndex = ast.fragment.nodes.findIndex(
    (n) => n.type === "SvelteHead",
  );
  const existingNodes = ast.fragment.nodes.splice(svelteHeadIndex + 1);

  ast.fragment.nodes.push({
    ...nodeBase,
    type: "Component",
    name: options.wrapper,
    attributes: options.attributes ?? [],
    fragment: {
      type: "Fragment",
      nodes: existingNodes,
    },
  });
}

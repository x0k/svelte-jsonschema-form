// This file is a separate entry point (see tsdown.config.js) so that
import {
  transforms,
  type AstTypes,
  type SvelteAst,
  Walker,
} from "@sveltejs/sv-utils";

// the addon's utilities are published as their own module on npm.
export * from "@sveltejs/sv-utils";

export function importsAddNamed(
  node: AstTypes.Program,
  options: {
    imports: Record<string, string> | string[];
    from: string;
    isType?: boolean;
  },
): void {
  const o_imports = Array.isArray(options.imports)
    ? Object.fromEntries(options.imports.map((n) => [n, n]))
    : options.imports;

  const specifiers = Object.entries(o_imports).map(([key, value]) => {
    const specifier: AstTypes.ImportSpecifier = {
      type: "ImportSpecifier",
      imported: {
        type: "Identifier",
        name: key,
      },
      local: {
        type: "Identifier",
        name: value,
      },
    };
    return specifier;
  });

  const expectedImportKind = options.isType ? "type" : "value";
  let importDecl: AstTypes.ImportDeclaration | undefined;

  Walker.walk(node as AstTypes.Node, null, {
    ImportDeclaration(declaration: AstTypes.ImportDeclaration) {
      if (
        declaration.source.value === options.from &&
        declaration.specifiers &&
        (declaration.importKind ?? "value") === expectedImportKind // <-- also match on kind
      ) {
        importDecl = declaration;
      }
    },
  });

  // merge the specifiers into a single import declaration if they share a source
  if (importDecl) {
    specifiers.forEach((specifierToAdd) => {
      const sourceExists = importDecl?.specifiers?.every(
        (existingSpecifier) =>
          existingSpecifier.type === "ImportSpecifier" &&
          existingSpecifier.local?.name !== specifierToAdd.local?.name &&
          existingSpecifier.imported.type === "Identifier" &&
          specifierToAdd.imported.type === "Identifier" &&
          existingSpecifier.imported.name !== specifierToAdd.imported.name,
      );
      if (sourceExists) {
        importDecl?.specifiers?.push(specifierToAdd);
      }
    });
    return;
  }

  const expectedImportDeclaration: AstTypes.ImportDeclaration = {
    type: "ImportDeclaration",
    source: {
      type: "Literal",
      value: options.from,
    },
    specifiers,
    attributes: [],
    importKind: expectedImportKind,
  };

  node.body.unshift(expectedImportDeclaration);
}

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

    importsAddNamed(ast.instance.content, {
      imports: ["resolve"],
      from: "$app/paths",
    });

    svelte.addFragment(ast, `<a href={resolve('/demo/${path}')}>${path}</a>`, {
      mode: "prepend",
    });
  });
}

export function createAsConst(
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

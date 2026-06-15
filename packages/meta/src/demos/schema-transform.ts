import * as acorn from "acorn";
import { tsPlugin } from "@sveltejs/acorn-typescript";
import type {
  SchemaValue,
  SchemaObjectValue,
  SchemaArrayValue,
  Schema,
} from "@sjsf/form/core";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/types";
import { parse, print, type AST } from "svelte/compiler";
import { walk } from "zimmerframe";
import type { Expression, Program, VariableDeclaration } from "estree";

export const acornTsParser = acorn.Parser.extend(tsPlugin());

export function getObjectExpression(expr: TSESTree.Expression) {
  if (expr.type === AST_NODE_TYPES.TSSatisfiesExpression) {
    expr = expr.expression;
  }
  if (expr.type === AST_NODE_TYPES.TSAsExpression) {
    expr = expr.expression;
  }
  if (expr.type === AST_NODE_TYPES.ObjectExpression) {
    return expr;
  }
}

export function isSchemaPage(filepath: string, content: string) {
  return (
    filepath.endsWith(".svelte") && /const\s+schema\s*?=\s*?{/gm.test(content)
  );
}

export function parseSveltePage(
  content: string,
  filepath: string
): {
  ast: AST.Root;
  state: { isSchemaTransformed: boolean; isOptionsTransformed: boolean };
} {
  return {
    ast: parse(content, { filename: filepath, modern: true }),
    state: { isSchemaTransformed: false, isOptionsTransformed: false },
  };
}

export function matchSchemaVariable(node: {
  id: { type: string; name?: string };
  init?: unknown;
}): Schema | null {
  if (
    node.id.type !== "Identifier" ||
    node.id.name !== "schema" ||
    !node.init
  ) {
    return null;
  }
  const objExpr = getObjectExpression(node.init as TSESTree.Expression);
  if (!objExpr) return null;
  const schema = astToSchemaValue(objExpr);
  if (!schema) return null;
  return schema as Schema;
}

export function findFormSchemaPropertyIndex(node: {
  properties: Array<{ type: string; key?: { type: string; name?: string } }>;
}): number {
  for (let i = 0; i < node.properties.length; i++) {
    const prop = node.properties[i]!;
    if (
      prop.type === "Property" &&
      prop.key?.type === "Identifier" &&
      prop.key.name === "schema"
    ) {
      return i;
    }
  }
  return -1;
}

export function findSchemaDeclIndex(
  body: Program["body"] | null | undefined
): number {
  if (!body) return -1;
  return body.findIndex((stmt) => {
    const decl = (stmt as VariableDeclaration).declarations?.[0];
    return (
      stmt.type === "VariableDeclaration" &&
      decl?.id.type === "Identifier" &&
      decl.id.name === "schema"
    );
  });
}

export function astToSchemaValue(
  node: TSESTree.Property["value"] | TSESTree.SpreadElement
): SchemaValue | undefined {
  switch (node.type) {
    case AST_NODE_TYPES.Literal:
      if (
        typeof node.value === "string" ||
        typeof node.value === "number" ||
        typeof node.value === "boolean" ||
        node.value === null
      ) {
        return node.value;
      }
      return undefined;
    case "ObjectExpression": {
      const obj: SchemaObjectValue = {};
      for (const prop of node.properties) {
        if (prop.type !== "Property") return undefined;
        if (prop.computed) return undefined;

        const key =
          prop.key.type === "Identifier"
            ? prop.key.name
            : prop.key.type === "Literal"
              ? prop.key.value
              : undefined;

        if (typeof key !== "string") return undefined;
        const value = astToSchemaValue(prop.value);
        if (value === undefined) return undefined;

        obj[key] = value;
      }

      return obj;
    }

    case "ArrayExpression": {
      const arr: SchemaArrayValue = [];
      for (const el of node.elements) {
        if (!el) return undefined;
        const value = astToSchemaValue(el);
        if (value === undefined) return undefined;
        arr.push(value);
      }
      return arr;
    }

    default:
      return undefined;
  }
}

export interface SchemaTransformerOptions {
  additionalImports: string;
  createSchemaCode: (schema: Schema) => string;
}

export type SchemaTransformer = (filename: string, content: string) => string;

export function createSchemaTransformer({
  additionalImports,
  createSchemaCode,
}: SchemaTransformerOptions): SchemaTransformer {
  return (filepath, content) => {
    if (!isSchemaPage(filepath, content)) return content;

    const { ast, state } = parseSveltePage(content, filepath);
    const extendedState = { ...state, isDefaultValidatorReferenced: false };

    const transformed = walk<AST.SvelteNode, typeof extendedState>(
      ast,
      extendedState,
      {
        VariableDeclarator(node, { state, next }) {
          const schema = matchSchemaVariable(node);
          if (state.isSchemaTransformed || !schema) {
            next();
            return;
          }
          const code = createSchemaCode(schema);
          const expr = acornTsParser.parseExpressionAt(code, 0, {
            sourceType: "module",
            ecmaVersion: 16,
          });
          state.isSchemaTransformed = true;
          return { ...node, init: expr as Expression } satisfies AST.SvelteNode;
        },
        ObjectExpression(node, { state, next }) {
          if (state.isOptionsTransformed) {
            next();
            return;
          }

          const schemaIndex = findFormSchemaPropertyIndex(node);
          if (schemaIndex === -1) {
            next();
            return;
          }

          state.isOptionsTransformed = true;

          const walked = next();
          const target = (walked ?? node) as typeof node;

          if (state.isDefaultValidatorReferenced) {
            return {
              ...target,
              properties: target.properties.with(schemaIndex, {
                type: "Property",
                method: false,
                shorthand: false,
                computed: false,
                key: { type: "Identifier", name: "schema" },
                value: { type: "Identifier", name: "sjsfSchema" },
                kind: "init",
              }),
            };
          }

          return {
            ...target,
            properties: target.properties.with(schemaIndex, {
              type: "SpreadElement",
              argument: {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "adapt",
                },
                arguments: [{ type: "Identifier", name: "schema" }],
                optional: false,
              },
            }),
          };
        },
        CallExpression(node, { state, next }) {
          if (
            state.isOptionsTransformed &&
            node.callee.type === "MemberExpression" &&
            node.callee.object.type === "Identifier" &&
            node.callee.object.name === "defaults" &&
            node.callee.property.type === "Identifier" &&
            node.callee.property.name === "validator"
          ) {
            state.isDefaultValidatorReferenced = true;
            return {
              type: "CallExpression",
              callee: { type: "Identifier", name: "sjsfValidator" },
              arguments: node.arguments,
              optional: node.optional ?? false,
            };
          }
          next();
        },
      }
    ) as AST.Root;

    if (
      extendedState.isSchemaTransformed &&
      extendedState.isOptionsTransformed
    ) {
      const importProgram = acornTsParser.parse(additionalImports, {
        sourceType: "module",
        ecmaVersion: 16,
      }) as unknown as Program;
      const body = transformed.instance?.content.body;
      body?.unshift(...importProgram.body);

      if (extendedState.isDefaultValidatorReferenced) {
        const destructuringProgram = acornTsParser.parse(
          "const { schema: sjsfSchema, validator: sjsfValidator } = adapt(schema);",
          { sourceType: "module", ecmaVersion: 16 }
        ) as unknown as Program;
        if (body) {
          const schemaDeclIndex = findSchemaDeclIndex(body);
          if (schemaDeclIndex >= 0) {
            body.splice(schemaDeclIndex + 1, 0, ...destructuringProgram.body);
          }
        }
      }

      return print(transformed).code;
    }
    return content;
  };
}

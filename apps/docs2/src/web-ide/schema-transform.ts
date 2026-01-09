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
import type { Expression } from "estree";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { jsonSchemaToValibot } from "json-schema-to-valibot";

const acornTsParser = acorn.Parser.extend(tsPlugin());

function getObjectExpression(expr: TSESTree.Expression) {
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

function astToSchemaValue(
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

export function createSchemaTransformer({
  additionalImports,
  createSchemaCode,
}: SchemaTransformerOptions) {
  return (filename: string, content: string): string => {
    if (
      !filename.endsWith(".svelte") ||
      !/(const\s+schema\s*?=\s*?{|)/gm.test(content)
    ) {
      return content;
    }
    const ast = parse(content, { filename, modern: true });

    const state = {
      isSchemaTransformed: false,
      isOptionsTransformed: false,
    };

    const transformed = walk<AST.SvelteNode, typeof state>(ast, state, {
      VariableDeclarator(node, { state, next }) {
        const { id, init, ...rest } = node;
        if (id.type !== "Identifier" || id.name !== "schema" || !init) {
          next();
          return;
        }
        const objExpr = getObjectExpression(init as TSESTree.Expression);
        if (state.isSchemaTransformed || objExpr === undefined) {
          return;
        }
        const schema = astToSchemaValue(objExpr);
        if (schema === undefined) {
          return;
        }
        const code = createSchemaCode(schema as Schema);
        const expr = acornTsParser.parseExpressionAt(code, 0, {
          sourceType: "module",
          ecmaVersion: 16,
        });
        state.isSchemaTransformed = true;
        return {
          ...rest,
          id,
          init: expr as Expression,
        } satisfies AST.SvelteNode;
      },
      ObjectExpression(node, { state }) {
        if (state.isOptionsTransformed) {
          return;
        }
        for (let i = 0; i < node.properties.length; i++) {
          const prop = node.properties[i];
          if (
            prop.type === "Property" &&
            prop.key.type === "Identifier" &&
            prop.key.name === "schema"
          ) {
            state.isOptionsTransformed = true;
            return {
              ...node,
              properties: node.properties.with(i, {
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
          }
        }
      },
    }) as AST.Root;
    if (state.isSchemaTransformed && state.isOptionsTransformed) {
      const { body } = acornTsParser.parse(additionalImports, {
        sourceType: "module",
        ecmaVersion: 16,
      });
      // @ts-expect-error
      transformed.instance?.content.body.unshift(...body);
      return print(transformed).code;
    }
    return content;
  };
}

export const schemaToZodTransform = createSchemaTransformer({
  additionalImports: `import * as z from "zod"; import { adapt } from "@sjsf/zod4-validator/classic";`,
  createSchemaCode: (schema) =>
    jsonSchemaToZod(schema, {
      noImport: true,
    }).replace(/\.record\(/g, ".record(z.string(), "),
});

export const schemaToValibotTransform = createSchemaTransformer({
  additionalImports: `import * as v from "valibot"; import { adapt } from "@sjsf/valibot-validator";`,
  createSchemaCode: (schema) =>
    jsonSchemaToValibot(schema as any, {
      module: "none",
    }).slice(15),
});

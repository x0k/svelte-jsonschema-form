import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { parse, print, type AST } from "svelte/compiler";
import { walk } from "zimmerframe";
import * as acorn from "acorn";
import { tsPlugin } from "@sveltejs/acorn-typescript";

const acornTsParser = acorn.Parser.extend(tsPlugin());

function isObjectExpression(expr: TSESTree.Expression) {
  if (expr.type === AST_NODE_TYPES.TSSatisfiesExpression) {
    expr = expr.expression;
  }
  if (expr.type === AST_NODE_TYPES.TSAsExpression) {
    expr = expr.expression;
  }
  return expr.type === AST_NODE_TYPES.ObjectExpression;
}

export function schemaToZodTransform(
  filename: string,
  content: string
): string {
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
      if (
        state.isSchemaTransformed ||
        !isObjectExpression(init as TSESTree.Expression)
      ) {
        return;
      }
      state.isSchemaTransformed = true;
      return {
        ...rest,
        id,
        init: {
          type: "CallExpression",
          callee: {
            type: "MemberExpression",
            object: { type: "Identifier", name: "z" },
            property: { type: "Identifier", name: "fromJSONSchema" },
            computed: false,
            optional: false,
          },
          arguments: [init],
          optional: false,
        },
      };
    },
    ObjectExpression(node, { state }) {
      if (state.isOptionsTransformed) {
        return;
      }
      for (let i = 0; i < node.properties.length; i++) {
        const prop = node.properties[i];
        if (
          prop.type === "Property" &&
          prop.shorthand &&
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
    const { body } = acornTsParser.parse(
      `import * as z from "zod"; import { adapt } from "@sjsf/zod4-validator/classic";`,
      {
        sourceType: "module",
        ecmaVersion: 16,
      }
    );
    // @ts-expect-error
    transformed.instance?.content.body.unshift(...body);
    return print(transformed).code;
  }
  return content;
}

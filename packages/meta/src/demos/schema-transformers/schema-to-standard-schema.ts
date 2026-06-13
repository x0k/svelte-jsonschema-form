import { print, type AST } from "svelte/compiler";
import { walk } from "zimmerframe";
import type { Program } from "estree";

import {
  isSchemaPage,
  parseSveltePage,
  matchSchemaVariable,
  findFormSchemaPropertyIndex,
  findSchemaDeclIndex,
  acornTsParser,
} from "../schema-transform.ts";

export default function standardSchemaTransformer(
  filepath: string,
  content: string,
) {
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
        state.isSchemaTransformed = true;
        next();
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
              arguments: [{ type: "Identifier", name: "fakeValidator" }],
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
    },
  ) as AST.Root;

  if (extendedState.isSchemaTransformed && extendedState.isOptionsTransformed) {
    const importCode = [
      `import { adapt } from "@sjsf/form/validators/standard-schema";`,
      `import type { StandardSchemaV1, StandardJSONSchemaV1 } from "@standard-schema/spec";`,
    ].join("\n");

    const fakeValidatorCode = `const fakeValidator = {
  "~standard": {
    version: 1,
    vendor: "sjsf",
    validate(value: unknown) {
      return value && typeof value === "object"
        ? { value }
        : { issues: [{ message: "Invalid", path: [] }] };
    },
    jsonSchema: {
      input: () => schema,
      output() {
        throw new Error("not implemented");
      }
    }
  }
} as const satisfies StandardSchemaV1 & StandardJSONSchemaV1;`;

    const importProgram = acornTsParser.parse(importCode, {
      sourceType: "module",
      ecmaVersion: 16,
    }) as unknown as Program;

    const fakeValidatorProgram = acornTsParser.parse(fakeValidatorCode, {
      sourceType: "module",
      ecmaVersion: 16,
    }) as unknown as Program;

    const body = transformed.instance?.content.body;
    body?.unshift(...importProgram.body);

    const schemaDeclIndex = findSchemaDeclIndex(body);
    if (body && schemaDeclIndex >= 0) {
      body.splice(schemaDeclIndex + 1, 0, ...fakeValidatorProgram.body);
    }

    if (extendedState.isDefaultValidatorReferenced) {
      const destructuringProgram = acornTsParser.parse(
        "const { schema: sjsfSchema, validator: sjsfValidator } = adapt(fakeValidator);",
        { sourceType: "module", ecmaVersion: 16 },
      ) as unknown as Program;
      if (body && schemaDeclIndex >= 0) {
        body.splice(schemaDeclIndex + 2, 0, ...destructuringProgram.body);
      }
    }

    return print(transformed).code;
  }

  return content;
}

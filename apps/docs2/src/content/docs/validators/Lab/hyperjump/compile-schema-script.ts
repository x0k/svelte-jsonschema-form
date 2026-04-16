import fs from "node:fs";
import path from "node:path";

import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import {
  registerSchema,
  type SchemaObject,
} from "@hyperjump/json-schema/draft-07";
import { compile, getSchema } from "@hyperjump/json-schema/experimental";
import { uneval } from "devalue";

import inputSchema from "../../shared/input-schema.json" with { type: "json" };

const fieldsValidationMode = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

// NOTE: After calling this function, be sure to save the `schema` and
// use it to generate the form
let id = 0;
const toId = (n: number) => `https://example.com/v${n}`;
const patch = insertSubSchemaIds(inputSchema as any, {
  fieldsValidationMode,
  createId: () => toId(id++),
});

// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
fs.writeFileSync(
  path.join(import.meta.dirname, "patched-schema.ts"),
  `import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = ${fieldsValidationMode}
export const schema = ${JSON.stringify(patch.schema, null, 2)} as const satisfies Schema;`
);

const schemas = fragmentSchema(patch);

for (const schema of schemas) {
  registerSchema(
    Object.assign(
      { $schema: "http://json-schema.org/draft-07/schema" },
      schema as SchemaObject
    )
  );
}

const { ast } = await compile(await getSchema(toId(0)));

fs.writeFileSync(
  path.join(import.meta.dirname, "ast.js"),
  `export const ast = ${uneval(ast)}`
);

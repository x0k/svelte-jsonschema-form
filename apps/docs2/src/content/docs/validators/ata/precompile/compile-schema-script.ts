import fs from "node:fs";
import path from "node:path";

import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import { Validator } from "ata-validator";
import { DEFAULT_VALIDATOR_OPTIONS } from "@sjsf-lab/ata-validator";

import inputSchema from "../../shared/input-schema.json" with { type: "json" };

const fieldsValidationMode = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

// NOTE: After calling this function, be sure to save the `schema` and
// use it to generate the form
const patch = insertSubSchemaIds(inputSchema as any, {
  fieldsValidationMode,
});

// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
fs.writeFileSync(
  path.join(import.meta.dirname, "patched-schema.ts"),
  `import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = ${fieldsValidationMode}
export const schema = ${JSON.stringify(patch.schema, null, 2)} as const satisfies Schema;`
);

const base = { $schema: "http://json-schema.org/draft-07/schema" };
const schemas = fragmentSchema(patch);
const bundle = Validator.bundleStandalone(
  schemas.map((s) => Object.assign(s, base)),
  { ...DEFAULT_VALIDATOR_OPTIONS, format: "esm" }
)
  .replace(
    "const validators",
    `export const [${schemas.map((s) => s.$id).join(", ")}]`
  )
  .slice(0, -50);

fs.writeFileSync(
  path.join(import.meta.dirname, "validate-functions.js"),
  bundle
);

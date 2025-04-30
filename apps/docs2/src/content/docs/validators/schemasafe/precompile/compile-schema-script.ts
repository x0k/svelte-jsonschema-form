import fs from "node:fs";
import path from "node:path";

import { validator } from '@exodus/schemasafe'

import { ON_INPUT } from '@sjsf/form';
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import { DEFAULT_VALIDATOR_OPTIONS, FORM_FORMATS } from '@sjsf/schemasafe-validator'

import inputSchema from './input-schema.json' with { type: "json" }

const fieldsValidationMode = ON_INPUT

// NOTE: After calling this function, be sure to save the `schema` and
// use it to generate the form
const patch = insertSubSchemaIds(inputSchema as any, { fieldsValidationMode });

// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
fs.writeFileSync(
  path.join(import.meta.dirname, "patched-schema.ts"),
  `import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = ${fieldsValidationMode}
export const schema = ${JSON.stringify(patch.schema, null, 2)} as const satisfies Schema;`
);

const schemas = fragmentSchema(patch)

// @ts-expect-error Typings for `multi` version are missing
const validate = validator(schemas, {
  ...DEFAULT_VALIDATOR_OPTIONS,
  formats: {
    ...FORM_FORMATS,
    "phone-us": /\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
    "area-code": /\d{3}/,
  },
  schemas: new Map(schemas.map(schema => [schema.$id, schema])),
  multi: true,
})

const validateFunctions = `export const [${schemas.map(s => s.$id).join(', ')}] = ${validate.toModule()}`

fs.writeFileSync(path.join(import.meta.dirname, "validate-functions.js"), validateFunctions)

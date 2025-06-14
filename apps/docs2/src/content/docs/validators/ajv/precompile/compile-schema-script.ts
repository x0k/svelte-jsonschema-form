import fs from "node:fs";
import path from "node:path";

import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";

import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from '@sjsf/form';
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import { addFormComponents } from "@sjsf/ajv8-validator";

import { build } from "esbuild";

import inputSchema from './input-schema.json' with { type: "json" }

const fieldsValidationMode = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE

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

const ajv = new Ajv({
  schemas: fragmentSchema(patch),
  formats: {
    "phone-us": /\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
    "area-code": /\d{3}/,
  },
  code: {
    source: true,
    esm: true,
  },
});
const modules = standaloneCode(addFormComponents(ajv));

// https://github.com/ajv-validator/ajv/issues/2209#issuecomment-2580172967
const { outputFiles } = await build({
  minify: true,
  bundle: true,
  write: false,
  format: "esm",
  sourcemap: false,
  stdin: {
    contents: modules,
    resolveDir: "/",
    sourcefile: "input.js",
    loader: "js",
  },
});
const bundle = outputFiles[0].text;

fs.writeFileSync(path.join(import.meta.dirname, "validate-functions.js"), bundle);

import {
  externalValidatorPackage,
  formPackage,
  internalValidatorSubPath,
} from "meta";
import {
  isEndsWithPrecompiled,
  POST_JSON_SCHEMA_PATH,
  type Context,
} from "./model.js";
import { transforms } from "./sv-utils.js";

export function scriptsFolder({
  options,
  directory,
  language,
  sv,
  ts,
}: Context) {
  const { validatorWithSuffix } = options;
  if (!isEndsWithPrecompiled(validatorWithSuffix)) {
    return;
  }

  sv.file(
    `scripts/compile-validators.${language}`,
    transforms.script(({ ast, comments, js }) => {
      js.common.appendFromString(ast, {
        comments,
        code: `import fs from "node:fs/promises";
import path from "node:path";

import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import addFormats from "ajv-formats";

import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "${formPackage.name}";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "${internalValidatorSubPath("precompile")}";
import { addFormComponents, DEFAULT_AJV_CONFIG } from "${externalValidatorPackage("ajv8").name}";

import { build } from "esbuild";

const FIELDS_VALIDATION_MODE = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;
const JSON_SCHEMA_PATHS = ["${directory.lib}${POST_JSON_SCHEMA_PATH}"];

async function compileSchema(schemaPath: string) {
  const source = await fs.readFile(schemaPath, "utf-8");
  const schema = JSON.parse(source);

  const patch = insertSubSchemaIds(schema, {
    fieldsValidationMode: FIELDS_VALIDATION_MODE,
  });

  const schemaDir = path.dirname(schemaPath);
  const schemaName = path.basename(schemaPath, ".json");
  // It is easier to save as a TS file
  // https://github.com/microsoft/TypeScript/issues/32063
  await fs.writeFile(
    path.join(schemaDir, \`\${schemaName}.generated.${language}\`),
    \`${ts('import type { Schema } from "${formPackage.name}";\\n')}export const fieldsValidationMode = \${FIELDS_VALIDATION_MODE}
export const schema = \${JSON.stringify(patch.schema, null, 2)}${ts(" as const satisfies Schema")};\`
  );

  const ajv = new Ajv({
    ...DEFAULT_AJV_CONFIG,
    schemas: fragmentSchema(patch),
    code: {
      source: true,
      esm: true,
    },
  });
  const modules = standaloneCode(addFormComponents(addFormats(ajv)));

  // https://github.com/ajv-validator/ajv/issues/2209#issuecomment-2580172967
  const { outputFiles } = await build({
    minify: true,
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    target: ["es2020"],
    sourcemap: false,
    stdin: {
      contents: modules,
      resolveDir: process.cwd(),
      sourcefile: "input.js",
      loader: "js",
    },
  });
  const bundle = outputFiles[0].text;

  await fs.writeFile(
    path.join(schemaDir, \`\${schemaName}.validators.js\`),
    bundle
  );
}

async function main() {
  await Promise.all(
    JSON_SCHEMA_PATHS.map((p) => compileSchema(path.resolve("..", p)))
  );
}

main();
`,
      });
    }),
  );
}

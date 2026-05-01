import {
  externalValidatorPackage,
  extraPackage,
  formPackage,
  internalValidatorSubPath,
  type PrecompiledValidator,
} from "meta";

import {
  isEndsWithPrecompiled,
  POST_JSON_SCHEMA_PATH,
  withoutPrecompiledSuffix,
  type Context,
} from "./model.js";
import { transforms } from "./sv-utils.js";

export function scriptsFolder({
  options,
  directory,
  file,
  language,
  sv,
  ts,
}: Context) {
  const { validatorWithSuffix } = options;
  if (!isEndsWithPrecompiled(validatorWithSuffix)) {
    return;
  }

  const validator = withoutPrecompiledSuffix(validatorWithSuffix);

  // TODO: add `Post` type generation in `generated` files
  const scripts: Record<PrecompiledValidator, string> = {
    ajv8: `import fs from "node:fs/promises";
import path from "node:path";

import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import addFormats from "${extraPackage("ajvFormat").name}";

import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "${formPackage.name}";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "${internalValidatorSubPath("precompile")}";
import { addFormComponents, DEFAULT_AJV_CONFIG } from "${externalValidatorPackage("ajv8").name}";

import { build } from "${extraPackage("esbuild").name}";

const FIELDS_VALIDATION_MODE = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;
const JSON_SCHEMA_PATHS = ["${directory.lib}${POST_JSON_SCHEMA_PATH}"];

async function compileSchema(schemaPath${ts(": string")}) {
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
    \`${ts(`import type { Schema } from "${formPackage.name}";\n`)}export const fieldsValidationMode = \${FIELDS_VALIDATION_MODE}
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

if (import.meta.main) {
  await main();
}
`,
    schemasafe: `import fs from "node:fs/promises";
import path from "node:path";

import { validator } from "@exodus/schemasafe";

import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "${formPackage.name}";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "${internalValidatorSubPath("precompile")}";
import {
  DEFAULT_VALIDATOR_OPTIONS,
  FORM_FORMATS,
} from "${externalValidatorPackage("schemasafe").name}";

const FIELDS_VALIDATION_MODE = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

const JSON_SCHEMA_PATHS = ["${directory.lib}${POST_JSON_SCHEMA_PATH}"];

async function compileSchema(schemaPath${ts(": string")}) {
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
    \`${ts(`import type { Schema } from "${formPackage.name}";\n`)}export const fieldsValidationMode = \${FIELDS_VALIDATION_MODE}
export const schema = \${JSON.stringify(patch.schema, null, 2)}${ts(" as const satisfies Schema")};\`
  );

  const schemas = fragmentSchema(patch);

  // @ts-expect-error Typings for \`multi\` version are missing
  const validate = validator(schemas, {
    ...DEFAULT_VALIDATOR_OPTIONS,
    formats: FORM_FORMATS,
    schemas: new Map(schemas.map((schema) => [schema.$id, schema])),
    multi: true,
  });

  const validateFunctions = \`export const [\${schemas.map((s) => s.$id).join(", ")}] = \${validate.toModule()}\`;

  await fs.writeFile(
    path.join(schemaDir, \`\${schemaName}.validators.js\`),
    validateFunctions
  );
}

async function main() {
  await Promise.all(
    JSON_SCHEMA_PATHS.map((p) => compileSchema(path.resolve("..", p)))
  );
}

if (import.meta.main) {
  await main();
}
`,
    hyperjump: `import fs from "node:fs/promises";
import path from "node:path";

import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "${formPackage.name}";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "${internalValidatorSubPath("precompile")}";
import {
  registerSchema,
  unregisterSchema,${ts("\n  type SchemaObject,")}
} from "@hyperjump/json-schema/draft-07";
import { compile, getSchema } from "@hyperjump/json-schema/experimental";
import { uneval } from "${extraPackage("devalue").name}";

const FIELDS_VALIDATION_MODE = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

const JSON_SCHEMA_PATHS = ["${directory.lib}${POST_JSON_SCHEMA_PATH}"];

async function compileSchema(schemaPath${ts(": string")}) {
  const source = await fs.readFile(schemaPath, "utf-8");
  const schema = JSON.parse(source);

  let id = 0;
  const toId = (n${ts(": number")}) => \`https://example.com/v\${n}\`;
  const patch = insertSubSchemaIds(schema, {
    fieldsValidationMode: FIELDS_VALIDATION_MODE,
    createId: () => toId(id++),
  });

  const schemaDir = path.dirname(schemaPath);
  const schemaName = path.basename(schemaPath, ".json");

  const schemas = fragmentSchema(patch);

  for (const schema of schemas) {
    registerSchema(
      Object.assign(
        { $schema: "http://json-schema.org/draft-07/schema" },
        schema${ts(" as SchemaObject")}
      )
    );
  }

  try {
    const { ast } = await compile(await getSchema(toId(0)));
    await fs.writeFile(
      path.join(schemaDir, \`\${schemaName}.generated.${language}\`),
      \`${ts('import type { Schema } from "@sjsf/form";\nimport type { AST } from "@hyperjump/json-schema/experimental";\n')}import { uneval } from "devalue";
export const fieldsValidationMode = \${FIELDS_VALIDATION_MODE};
export const schema = \${JSON.stringify(patch.schema, null, 2)}${ts(" as const satisfies Schema")};
export const ast = \${uneval(ast)}${ts(" as unknown as AST")};\`
    );
  } finally {
    for (const schema of schemas) {
      unregisterSchema(schema.$id${ts("!")});
    }
  }
}

async function main() {
  for (const p of JSON_SCHEMA_PATHS) {
    await compileSchema(path.resolve("..", p));
  }
}

if (import.meta.main) {
  await main();
}
`,
  };

  sv.file(
    `scripts/compile-validators.${language}`,
    transforms.script(({ ast, comments, js }) => {
      js.common.appendFromString(ast, {
        comments,
        code: scripts[validator],
      });
    }),
  );

  sv.file(
    file.package,
    transforms.json(({ data, json }) => {
      json.packageScriptsUpsert(
        data,
        "sjsf:compile",
        `node scripts/compile-validators.${language}`,
      );
      json.packageScriptsUpsert(data, "prepare", "npm run sjsf:compile");
    }),
  );
}

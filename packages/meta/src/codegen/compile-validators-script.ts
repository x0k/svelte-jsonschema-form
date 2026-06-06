import { transforms } from "@sveltejs/sv-utils";

import { extraPackage } from "../package.ts";
import { formPackage } from "../form.ts";
import {
  externalValidatorPackage,
  internalValidatorSubPath,
} from "../validators.ts";

import {
  fieldsValidationModeFlags,
  type CodegenPrecompiledValidator,
  type ConditionalPrinter,
  type FieldsValidationMode,
  type Language,
} from "./model.ts";

export interface CompileValidatorsScriptOptions {
  validator: CodegenPrecompiledValidator;
  ts: ConditionalPrinter;
  language: Language;
  fieldsValidationMode: FieldsValidationMode;
  /** paths to model directories from project root */
  modelPaths: string[];
}

export function createCompileValidatorsScript(
  options: CompileValidatorsScriptOptions,
) {
  const { validator, ts } = options;

  const hyperjump_precompiled = createScriptRenderer({
    parallel: false,
    vendorImports: `import {
  registerSchema,
  unregisterSchema,${ts("\n  type SchemaObject,")}
} from "@hyperjump/json-schema/draft-07";
import { ${ts("type AST, ")}getSchema, Validation } from "@hyperjump/json-schema/experimental";
import { uneval } from "${extraPackage("devalue").name}";`,
    compileSchemaBody: ({ definePatchAndSchemas, saveModel }) => `let id = 0;
const toId = (n${ts(": number")}) => \`https://example.com/v\${n}\`;
${definePatchAndSchemas(`createId: () => toId(id++)`)}

for (const schema of schemas) {
  registerSchema(
    Object.assign(
      { $schema: "http://json-schema.org/draft-07/schema" },
      schema${ts(" as SchemaObject")}
    )
  );
}

try {
  // https://github.com/hyperjump-io/json-schema/issues/116
  const ast = { metaData: {}, plugins: new Set() }${ts(" as unknown as AST")};
  for (const schema of schemas) {
    const s = await getSchema(schema.$id!);
    await Validation.compile(s, ast, s);
  }
  ${saveModel({
    importStatements: `import { uneval } from "devalue"${ts(`;
import type { AST } from "@hyperjump/json-schema/experimental"`)};`,
    exportStatements: `export const ast = \${uneval(ast)}${ts(" as unknown as AST")};`,
  })};
} finally {
  for (const schema of schemas) {
    unregisterSchema(schema.$id${ts("!")});
  }
}

`,
  });

  const scripts: Record<
    CodegenPrecompiledValidator,
    (ctx: CompileValidatorsScriptOptions) => string
  > = {
    ajv8_precompiled,
    schemasafe_precompiled,
    hyperjump_precompiled,
    ata_precompiled,
  };

  return transforms.script(({ ast, comments, js }) => {
    const code = scripts[validator](options);
    js.common.appendFromString(ast, {
      comments,
      code,
    });
  });
}

interface ScriptOptions {
  vendorImports: string;
  compileSchemaBody: (options: {
    definePatchAndSchemas: (extra?: string) => string;
    saveModel: (
      options?: Partial<{
        importStatements: string;
        exportStatements: string;
      }>,
    ) => string;
    saveValidators: (content: string) => string;
  }) => string;
  parallel: boolean;
}

function createScriptRenderer({
  vendorImports,
  compileSchemaBody,
  parallel,
}: ScriptOptions) {
  return ({
    modelPaths,
    ts,
    language,
    fieldsValidationMode,
  }: CompileValidatorsScriptOptions) => {
    const flags = fieldsValidationModeFlags(fieldsValidationMode);
    const flagsExpr = flags.join(", ");
    const runtimeFlagsImport =
      flags.length > 0
        ? `import { ${flagsExpr} } from "${formPackage.name}";\n\n`
        : "";
    const modelFlagsImport =
      flags.length > 0
        ? `import { \${FIELDS_VALIDATION_KEYS} } from "${formPackage.name}";\n`
        : "";
    const modelFieldsValidationModeExport =
      flags.length > 0
        ? `\nexport const fieldsValidationMode = \${FIELDS_VALIDATION_MODE};\n`
        : "";
    return `import fs from "node:fs/promises";
import path from "node:path";

${runtimeFlagsImport}import {
  insertSubSchemaIds,
  fragmentSchema,
} from "${internalValidatorSubPath("precompile")}";

${vendorImports};

const FIELDS_VALIDATION = { ${flagsExpr} };
const FIELDS_VALIDATION_KEYS = Object.keys(FIELDS_VALIDATION).join(", ");
const FIELDS_VALIDATION_MODE = Object.keys(FIELDS_VALIDATION).join(" | ");
const FIELDS_VALIDATION_MODE_VALUE = Object.values(FIELDS_VALIDATION).reduce(
  (a, b) => a | b,
);
const MODEL_PATHS = ${JSON.stringify(modelPaths)};
const SCRIPT_PATH = path.relative(process.cwd(), import.meta.filename);

async function readJson(dir${ts(": string")}, file${ts(": string")}) {
  const filePath = path.join(dir, file);
  try {
    await fs.access(filePath);
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch {
    return null;
  }
}

async function compileSchema(modelDirRelPath${ts(": string")}) {
  const modelDir = path.resolve(modelDirRelPath);
  const schema = await readJson(modelDir, "schema.json");
  if (!schema) {
    throw new Error(\`schema.json file not found in "\${modelDir}" directory\`)
  }
  const uiSchema = await readJson(modelDir, "ui-schema.json");
  const initialValue = await readJson(modelDir, "initial-value.json");

  ${compileSchemaBody({
    definePatchAndSchemas: (
      extraProperties = "",
    ) => `const patch = insertSubSchemaIds(schema, {
  fieldsValidationMode: FIELDS_VALIDATION_MODE_VALUE,
  ${extraProperties}
});
const schemas = fragmentSchema(patch)`,
    saveModel: ({
      importStatements = "",
      exportStatements = "",
    } = {}) => `// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
await fs.writeFile(
  path.join(modelDir, "model.generated.${language}"),
  \`// Generated by \${SCRIPT_PATH} - do not edit
${ts(`import type { Schema, UiSchemaRoot } from "${formPackage.name}";
import type { FromSchema } from "${extraPackage("jsonSchemaToTs").name}";
`)}${modelFlagsImport}${importStatements}${modelFieldsValidationModeExport}export const schema = \${JSON.stringify(patch.schema, null, 2)}${ts(` as const satisfies Schema;
export type Model = FromSchema<typeof schema>`)};
${exportStatements}\${uiSchema ? "\\nexport const uiSchema = " + JSON.stringify(uiSchema, null, 2) + "${ts(" as const satisfies UiSchemaRoot")};" : ""}\${initialValue ? "\\nexport const initialValue = " + JSON.stringify(initialValue, null, 2) + ";" : ""}\`
  )`,
    saveValidators: (content) =>
      `await fs.writeFile(path.join(modelDir, "validators.generated.js"), \`// @ts-nocheck\\n\${${content}}\`)`,
  })}
}

async function main() {
  ${
    parallel
      ? `await Promise.all(
    MODEL_PATHS.map(compileSchema)
  );`
      : `for (const p of MODEL_PATHS) {
    await compileSchema(p)
  }`
  }
}

if (import.meta.main) {
  await main();
}
`;
  };
}

const ajv8_precompiled = createScriptRenderer({
  parallel: true,
  vendorImports: `import { addFormComponents, DEFAULT_AJV_CONFIG } from "${externalValidatorPackage("ajv8").name}";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import addFormats from "${extraPackage("ajvFormat").name}";
import { build } from "${extraPackage("esbuild").name}"`,
  compileSchemaBody: ({
    definePatchAndSchemas,
    saveModel,
    saveValidators,
  }) => `${definePatchAndSchemas()};
${saveModel()};

const ajv = new Ajv({
  ...DEFAULT_AJV_CONFIG,
  schemas,
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
${saveValidators("bundle")};`,
});

const schemasafe_precompiled = createScriptRenderer({
  parallel: true,
  vendorImports: `import { validator } from "@exodus/schemasafe";
import {
  DEFAULT_VALIDATOR_OPTIONS,
  FORM_FORMATS,
} from "${externalValidatorPackage("schemasafe").name}"`,
  compileSchemaBody: ({
    definePatchAndSchemas,
    saveModel,
    saveValidators,
  }) => `${definePatchAndSchemas()};
${saveModel()};
// @ts-expect-error Typings for \`multi\` version are missing
const validate = validator(schemas, {
  ...DEFAULT_VALIDATOR_OPTIONS,
  formats: FORM_FORMATS,
  schemas: new Map(schemas.map((schema) => [schema.$id, schema])),
  multi: true,
});

const validateFunctions = \`export const [\${schemas.map((s) => s.$id).join(", ")}] = \${validate.toModule()}\`;

${saveValidators("validateFunctions")};`,
});

const ata_precompiled = createScriptRenderer({
  parallel: true,
  vendorImports: `import { Validator } from "ata-validator";
import {
  DEFAULT_VALIDATOR_OPTIONS,
  COLOR_FORMAT_REGEX,
  DATA_URL_FORMAT_REGEX,
} from "${externalValidatorPackage("ata").name}"

const FORM_FORMATS = \`const COLOR_FORMAT_REGEX = \${COLOR_FORMAT_REGEX.toString()};
const DATA_URL_FORMAT_REGEX = \${DATA_URL_FORMAT_REGEX.toString()}\`;`,
  compileSchemaBody: ({
    definePatchAndSchemas,
    saveModel,
    saveValidators,
  }) => `${definePatchAndSchemas()};
${saveModel()};

const base = { $schema: "http://json-schema.org/draft-07/schema" };
const bundle = Validator.bundleStandalone(
  schemas.map((s) => Object.assign(s, base)),
  { ...DEFAULT_VALIDATOR_OPTIONS, format: "esm" }
)
  .replace(
    "const validators",
    \`export const [\${schemas.map((s) => s.$id).join(", ")}]\`
  )
  .slice(0, -50);

${saveValidators("FORM_FORMATS}\\n${bundle")}
`,
});

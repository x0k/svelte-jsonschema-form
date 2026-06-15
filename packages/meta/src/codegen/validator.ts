import { neverError } from "../errors.ts";
import { extraPackage } from "../package.ts";
import {
  externalValidatorPackage,
  hyperjumpValidatorLocalizationSubPath,
  internalValidatorSubPath,
  isSchemaValidator,
  precompiledValidatorSubPath,
  zod4ValidatorVersionSubPath,
} from "../validators.ts";
import type { NamedImportOptions, NamespaceImportOptions } from "./lib.ts";
import {
  type Codegen2020Validator,
  type CodegenValidator,
  type ConditionalPrinter,
  type PathFactory,
} from "./model.ts";

export interface ValidatorOptions {
  validator: CodegenValidator;
  isTs: boolean;
  lib: PathFactory;
  modelName: string;
}

export interface ValidatorDefinition {
  schemaImports: (NamedImportOptions | NamespaceImportOptions)[];
  imports: (NamedImportOptions | NamespaceImportOptions)[];
  validatorProp: string;
  canInferFormType: boolean;
}

export function createValidator({
  validator,
  lib,
  modelName,
}: ValidatorOptions): ValidatorDefinition {
  if (validator.draft2020) {
    return {
      canInferFormType: false,
      schemaImports: [],
      imports: [],
      validatorProp: "",
    };
  }
  if (validator.precompiled) {
    if (validator.name === "hyperjump") {
      return {
        canInferFormType: false,
        schemaImports: [],
        imports: [
          {
            as: modelName,
            from: lib(`${modelName}/model.generated`),
          },
          {
            imports: ["ast"],
            from: lib(`${modelName}/ast.generated`),
          },
          {
            imports: ["createValidatorRetriever"],
            from: internalValidatorSubPath("precompile"),
          },
          {
            imports: ["createFormValidatorFactory"],
            from: precompiledValidatorSubPath(validator.name),
          },
          {
            imports: ["localization"],
            from: hyperjumpValidatorLocalizationSubPath("en-us"),
          },
        ],
        validatorProp: `validator: createFormValidatorFactory({ 
  validatorRetriever: createValidatorRetriever({
    registry: {
      get(id) {
        const schemaUri = \`\${id}#\`;
        return schemaUri in ast
          ? {
              schemaUri,
              ast,
            }
          : undefined;
      },
    },
  }),
  localization
})`,
      };
    }
    return {
      canInferFormType: false,
      schemaImports: [
        {
          as: modelName,
          from: lib(`${modelName}/model.generated`),
        },
      ],
      imports: [
        {
          imports: ["fromValidators"],
          from: internalValidatorSubPath("precompile"),
        },
        {
          imports: ["createFormValidatorFactory"],
          from: precompiledValidatorSubPath(validator.name),
        },
        {
          as: "validateFunctions",
          from: lib(`${modelName}/validators.generated`),
        },
      ],
      validatorProp: `validator: createFormValidatorFactory({
  validatorRetriever: fromValidators(validateFunctions),
})`,
    };
  }
  if (isSchemaValidator(validator.name)) {
    const v = (
      {
        zod4: {
          import: {
            as: "z",
            from: "zod",
          },
          path: zod4ValidatorVersionSubPath("classic"),
          inferInput: "z.infer",
        },
        valibot: {
          import: {
            as: "v",
            from: "valibot",
          },
          path: externalValidatorPackage("valibot").name,
          inferInput: "v.InferInput",
        },
        "standard-schema": {
          import: {
            imports: ["StandardSchemaV1"],
            from: "@standard-schema/spec",
            isType: true,
          },
          path: internalValidatorSubPath("standard-schema"),
          inferInput: "StandardSchemaV1.InferInput",
        },
      } satisfies Record<
        typeof validator.name,
        {
          import: NamedImportOptions | NamespaceImportOptions;
          path: string;
          inferInput: string;
        }
      >
    )[validator.name];
    const schemaProp = `...adapt(${modelName}.schema)`;
    return {
      schemaImports: [],
      imports: [
        {
          imports: ["adapt"],
          from: v.path,
        },
        {
          as: modelName,
          from: lib(modelName),
        },
      ],
      validatorProp: schemaProp,
      canInferFormType: true,
    };
  }
  return {
    canInferFormType: false,
    schemaImports: [
      {
        as: modelName,
        from: lib(modelName),
      },
    ],
    imports: [],
    validatorProp: ``,
  };
}

export interface Draft2020ValidatorImport {
  from: string;
  imports?: string[] | Record<string, string>;
  isType?: boolean;
  as?: string;
  isDefault?: boolean;
}

export interface Draft2020ValidatorExport {
  imports: Draft2020ValidatorImport[];
  code: string;
}

function buildValidatorFactoryCode(
  ts: ConditionalPrinter,
  body: string
): string {
  return ts(
    `export function validator<T>(options: ValidatorFactoryOptions) {
  return createFormValidator<T>({
    ...options,
    ${body}
  });
}`,
    `/**
 * @template T
 * @param {import("@sjsf/form").ValidatorFactoryOptions} options
 * @returns {ReturnType<typeof createFormValidator<T>>}
 */
export const validator = (options) => createFormValidator({
  ...options,
  ${body}
});`
  );
}

function buildPrecompiledValidatorFactoryCode(
  ts: ConditionalPrinter,
  body: string
): string {
  return ts(
    `export function validator<T>(options: ValidatorFactoryOptions) {
  return createFormValidatorFactory({
    ${body}
    ...options,
  });
}`,
    `/**
 * @template T
 * @param {import("@sjsf/form").ValidatorFactoryOptions} options
 */
export const validator = (options) => createFormValidatorFactory({
  ${body}
  ...options,
});`
  );
}

export function createDraft2020ValidatorExport(
  validator: Codegen2020Validator,
  ts: ConditionalPrinter
): Draft2020ValidatorExport {
  switch (validator.name) {
    case "ajv8": {
      return {
        imports: [
          {
            imports: ["addFormComponents", "createFormValidator"],
            from: externalValidatorPackage("ajv8").name,
          },
          { imports: ["Ajv2020"], from: "ajv/dist/2020.js" },
          {
            from: extraPackage("ajvFormat").name,
            as: "addFormats",
            isDefault: true,
          },
        ],
        code: buildValidatorFactoryCode(
          ts,
          "Ajv: Ajv2020, ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))"
        ),
      };
    }
    case "cfworker": {
      return {
        imports: [
          {
            imports: ["createFormValidator"],
            from: externalValidatorPackage("cfworker").name,
          },
          {
            imports: ["Validator", "type Schema"],
            from: "@cfworker/json-schema",
          },
        ],
        code: buildValidatorFactoryCode(
          ts,
          `factory: (schema) => new Validator(schema, "2020-12", false)`
        ),
      };
    }
    case "schemasafe": {
      return {
        imports: [
          {
            imports: [
              "createFormValidator",
              "DEFAULT_VALIDATOR_OPTIONS as DEFAULT_SCHEMASAFE_OPTIONS",
            ],
            from: externalValidatorPackage("schemasafe").name,
          },
          {
            imports: ["validator as safeValidator", "type Schema"],
            from: "@exodus/schemasafe",
          },
          { imports: ["ROOT_SCHEMA_PREFIX"], from: "@sjsf/form/core" },
        ],
        code: buildValidatorFactoryCode(
          ts,
          `factory: (schema, rootSchema) =>
      safeValidator(schema, {
        ...DEFAULT_SCHEMASAFE_OPTIONS,
        $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
        schemas: {
          [ROOT_SCHEMA_PREFIX]: rootSchema,
        },
      })`
        ),
      };
    }
    case "ata": {
      return {
        imports: [
          {
            imports: [
              "createFormValidator",
              "DEFAULT_VALIDATOR_OPTIONS as DEFAULT_ATA_OPTIONS",
            ],
            from: externalValidatorPackage("ata").name,
          },
          { imports: ["Validator"], from: "ata-validator" },
        ],
        code: buildValidatorFactoryCode(
          ts,
          `factory: (schema) => new Validator(schema, DEFAULT_ATA_OPTIONS)`
        ),
      };
    }
    case "hyperjump": {
      return {
        imports: [
          { as: "model", from: "@sjsf/form/.." },
          { imports: ["ast"], from: "@sjsf/form/../ast.generated" },
          {
            imports: ["createValidatorRetriever"],
            from: internalValidatorSubPath("precompile"),
          },
          {
            imports: ["createFormValidatorFactory"],
            from: `${externalValidatorPackage("hyperjump").name}/precompile`,
          },
          {
            imports: ["localization"],
            from: `${externalValidatorPackage("hyperjump").name}/localizations/en-us`,
          },
        ],
        code: buildPrecompiledValidatorFactoryCode(
          ts,
          `validatorRetriever: createValidatorRetriever({
    registry: {
      get(id) {
        const schemaUri = \`\${id}#\`;
        return schemaUri in ast
          ? {
              schemaUri,
              ast,
            }
          : undefined;
      },
    },
  }),
  localization`
        ),
      };
    }
    default:
      throw neverError(validator, "unsupported 2020 validator");
  }
}

function wrap(value: string) {
  return value && `${value},`;
}

export function validatorProp({ validatorProp }: ValidatorDefinition) {
  return wrap(validatorProp);
}

export function schemaAndValidatorProp(
  modelName: string,
  { canInferFormType, validatorProp }: ValidatorDefinition
) {
  const validator = wrap(validatorProp);
  return canInferFormType ? validator : `...${modelName},\n  ${validator}`;
}

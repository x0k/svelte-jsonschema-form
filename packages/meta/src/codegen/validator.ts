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
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
  type CodegenValidator,
  type PathFactory,
} from "./model.ts";

export interface ValidatorOptions {
  validatorWithSuffix: CodegenValidator;
  isTs: boolean;
  lib: PathFactory;
  modelName: string;
}

export interface ValidatorDefinition {
  schemaImports: (NamedImportOptions | NamespaceImportOptions)[];
  imports: (NamedImportOptions | NamespaceImportOptions)[];
  options: string;
  inputType: string;
  canInferFormType: boolean;
}

export function createValidator({
  validatorWithSuffix,
  lib,
  modelName,
}: ValidatorOptions): ValidatorDefinition {
  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    if (validator === "hyperjump") {
      return {
        inputType: `${modelName}.Model`,
        canInferFormType: false,
        schemaImports: [],
        imports: [
          {
            as: modelName,
            from: lib(`${modelName}/model.generated`),
          },
          {
            imports: ["createValidatorRetriever"],
            from: internalValidatorSubPath("precompile"),
          },
          {
            imports: ["createFormValidatorFactory"],
            from: precompiledValidatorSubPath(validator),
          },
          {
            imports: ["localization"],
            from: hyperjumpValidatorLocalizationSubPath("en-us"),
          },
        ],
        options: `schema: ${modelName}.schema,
validator: createFormValidatorFactory({ 
  validatorRetriever: createValidatorRetriever({
    registry: {
      get(id) {
        const schemaUri = \`\${id}#\`;
        return schemaUri in ${modelName}.ast
          ? {
              schemaUri,
              ast: ${modelName}.ast,
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
      inputType: `${modelName}.Model`,
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
          from: precompiledValidatorSubPath(validator),
        },
        {
          as: "validateFunctions",
          from: lib(`${modelName}/validators.generated`),
        },
      ],
      options: `schema: ${modelName}.schema,
validator: createFormValidatorFactory({
  validatorRetriever: fromValidators(validateFunctions),
})`,
    };
  }
  if (isSchemaValidator(validatorWithSuffix)) {
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
        typeof validatorWithSuffix,
        {
          import: NamedImportOptions | NamespaceImportOptions;
          path: string;
          inferInput: string;
        }
      >
    )[validatorWithSuffix];
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
      options: `...adapt(${modelName}.schema)`,
      inputType: `${modelName}.Model`,
      canInferFormType: true,
    };
  }
  return {
    inputType: `${modelName}.Model`,
    canInferFormType: false,
    schemaImports: [
      {
        as: modelName,
        from: lib(modelName),
      },
    ],
    imports: [],
    options: `schema: ${modelName}.schema`,
  };
}

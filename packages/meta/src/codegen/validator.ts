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
  validatorProp: string;
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
            from: precompiledValidatorSubPath(validator),
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
          from: precompiledValidatorSubPath(validator),
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

function wrap(value: string) {
  return value && `${value},`;
}

export function validatorProp({ validatorProp }: ValidatorDefinition) {
  return wrap(validatorProp);
}

export function schemaAndValidatorProp(
  modelName: string,
  { canInferFormType, validatorProp }: ValidatorDefinition,
) {
  const validator = wrap(validatorProp);
  return canInferFormType ? validator : `...${modelName},\n  ${validator}`;
}

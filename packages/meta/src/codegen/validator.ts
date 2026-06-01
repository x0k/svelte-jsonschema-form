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
}

interface ValidatorDefinition {
  schemaImports: (NamedImportOptions | NamespaceImportOptions)[];
  imports: (NamedImportOptions | NamespaceImportOptions)[];
  options: string;
  inputType: string;
  schemaValidator: boolean;
}

const createPostType = {
  inputType: "Post",
  schemaValidator: false,
} satisfies Omit<ValidatorDefinition, "imports" | "schemaImports" | "options">;

export function createValidator({
  validatorWithSuffix,
  isTs,
  lib,
}: ValidatorOptions): ValidatorDefinition {
  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    const types = isTs
      ? [
          {
            imports: ["Post"],
            from: lib("post/model.generated"),
            isType: true,
          },
        ]
      : [];
    if (validator === "hyperjump") {
      return {
        ...createPostType,
        schemaImports: [
          {
            imports: ["schema"],
            from: lib("post/model.generated"),
          },
          ...types,
        ],
        imports: [
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
          {
            imports: ["ast"],
            from: lib("post/model.generated"),
          },
        ],
        options: `schema,
validator: createFormValidatorFactory({ 
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
      ...createPostType,
      schemaImports: [
        {
          imports: ["schema"],
          from: lib("post/model.generated"),
        },
        ...types,
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
          from: lib("post/validators.generated"),
        },
      ],
      options: `schema,
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
      schemaImports: [v.import],
      imports: [
        {
          imports: ["adapt"],
          from: v.path,
        },
        {
          imports: ["post"],
          from: lib("post"),
        },
      ],
      options: `...adapt(post)`,
      inputType: `${v.inferInput}<typeof post>`,
      schemaValidator: true,
    };
  }
  return {
    ...createPostType,
    schemaImports: [
      {
        imports: ["schema"],
        from: lib("post"),
      },
      ...(isTs
        ? [
            {
              imports: ["Post"],
              from: lib("post"),
              isType: true,
            },
          ]
        : []),
    ],
    imports: [],
    options: "schema",
  };
}

import {
  Validator as CfValidator,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import {
  validator as safeValidator,
  type Schema as SafeSchema,
} from "@exodus/schemasafe";
import {
  registerSchema,
  unregisterSchema,
  type SchemaObject,
} from "@hyperjump/json-schema/draft-07";
import {
  getSchema,
  Validation,
  type AST,
} from "@hyperjump/json-schema/experimental";
import {
  createFormValidator as ata,
  DEFAULT_VALIDATOR_OPTIONS as DEFAULT_ATA_OPTIONS,
} from "@sjsf-lab/ata-validator";
import {
  createFormValidatorFactory as ataFactory,
  type ValidateFunctions as AtaValidateFunctions,
} from "@sjsf-lab/ata-validator/precompile";
import { localization } from "@sjsf-lab/hyperjump-validator/localizations/en-us";
import {
  fromAst,
  createFormValidatorFactory as hyperjumpFactory,
} from "@sjsf-lab/hyperjump-validator/precompile";
import {
  addFormComponents,
  createFormValidator as ajv8,
  DEFAULT_AJV_CONFIG,
} from "@sjsf/ajv8-validator";
import {
  createFormValidatorFactory as ajvFactory,
  type ValidateFunctions as AjvValidateFunctions,
} from "@sjsf/ajv8-validator/precompile";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import {
  create,
  isAsyncFormValueValidator,
  isFormValueValidator,
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type AsyncFormValueValidator,
  type Creatable,
  type FormValidator,
  type FormValueValidator,
  type Schema,
  type UiSchema,
} from "@sjsf/form";
import { convert } from "@sjsf/form/converters/draft-2020-12";
import { ROOT_SCHEMA_PREFIX, type Merger } from "@sjsf/form/core";
import {
  insertSubSchemaIds,
  createIdFactory as defaultCreateIdFactory,
  fragmentSchema,
  fromValidators,
} from "@sjsf/form/validators/precompile";
import {
  DEFAULT_VALIDATOR_OPTIONS as DEFAULT_SCHEMASAFE_OPTIONS,
  createFormValidator as schemasafe,
} from "@sjsf/schemasafe-validator";
import {
  createFormValidatorFactory as schemasafeFactory,
  type ValidateFunctions as SchemasafeValidateFunctions,
} from "@sjsf/schemasafe-validator/precompile";
import { adaptAsync as valibotAdapt } from "@sjsf/valibot-validator";
import { adaptAsync as zodAdapt } from "@sjsf/zod4-validator/classic";
import { Ajv } from "ajv";
import _addFormats, { type FormatsPlugin } from "ajv-formats";
import { Ajv2020 } from "ajv/dist/2020.js";
import standaloneCode from "ajv/dist/standalone/index.js";
import { Validator as AtaValidator } from "ata-validator";
import { build, initialize } from "esbuild-wasm";
import wasmURL from "esbuild-wasm/esbuild.wasm?url";

import type { Draft2020, Precompiled } from "../codegen/model.ts";
import { importModule } from "../modules.ts";
import { normalizeValidator, type PlaygroundValidator } from "./model.ts";

const addFormats = _addFormats as unknown as FormatsPlugin;

interface ValidatorFactoryOptions {
  uiSchema?: UiSchema;
  merger: () => Merger;
}

export type CreatableValidator = Creatable<
  FormValidator<unknown>,
  ValidatorFactoryOptions
>;

type ValidatorFactory = (schema: object) => Promise<{
  schema: Schema;
  validator: CreatableValidator;
}>;

function isDraft2020(schema: Schema) {
  return schema.$schema?.startsWith(
    "https://json-schema.org/draft/2020-12/schema"
  );
}

function toFactory(validator: CreatableValidator) {
  return async (schema: object) => ({
    schema,
    validator,
  });
}

const NORMAL: Record<
  Extract<PlaygroundValidator, Precompiled<false> & Draft2020<false>>["name"],
  ValidatorFactory
> = {
  ajv8: toFactory((options) =>
    ajv8({
      ...options,
      ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
    })
  ),
  cfworker: toFactory(cfworker),
  schemasafe: toFactory(schemasafe),
  ata: toFactory(ata),
  zod4: async (schema) => zodAdapt(schema as Parameters<typeof zodAdapt>[0]),
  valibot: async (schema) =>
    valibotAdapt(schema as Parameters<typeof valibotAdapt>[0]),
};

function to2020Factory(validator: CreatableValidator): ValidatorFactory {
  return async (originalSchema) => {
    if (!isDraft2020(originalSchema)) {
      return {
        schema: originalSchema,
        validator,
      };
    }
    const schema = convert(originalSchema as Parameters<typeof convert>[0]);
    return {
      schema,
      validator: (options) => {
        const v = create(validator, options);
        if (isAsyncFormValueValidator(v)) {
          return {
            ...v,
            validateFormValueAsync(signal, _rootSchema, formValue) {
              return v.validateFormValueAsync(
                signal,
                originalSchema,
                formValue
              );
            },
          } satisfies AsyncFormValueValidator<unknown>;
        }
        if (isFormValueValidator(v)) {
          return {
            ...v,
            validateFormValue(_rootSchema, formValue) {
              return v.validateFormValue(originalSchema, formValue);
            },
          } satisfies FormValueValidator<unknown>;
        }
        return v;
      },
    };
  };
}

const DRAFT_2020: Record<
  Extract<PlaygroundValidator, Draft2020<true>>["name"],
  ValidatorFactory
> = {
  ajv8: to2020Factory((options) =>
    ajv8({
      ...options,
      Ajv: Ajv2020,
      ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
    })
  ),
  cfworker: to2020Factory((options) =>
    cfworker({
      ...options,
      factory: (schema) =>
        new CfValidator(schema as CfSchema, "2020-12", false),
    })
  ),
  schemasafe: to2020Factory((options) =>
    schemasafe({
      ...options,
      factory: (schema, rootSchema) =>
        safeValidator(schema as SafeSchema, {
          ...DEFAULT_SCHEMASAFE_OPTIONS,
          $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
          schemas: {
            [ROOT_SCHEMA_PREFIX]: rootSchema as SafeSchema,
          },
        }),
    })
  ),
  ata: to2020Factory((options) =>
    ata({
      ...options,
      factory: (schema) => new AtaValidator(schema, DEFAULT_ATA_OPTIONS),
    })
  ),
};

const ON_EVERYTHING =
  ON_INPUT | ON_CHANGE | ON_BLUR | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE;

function toPrecompiledFactory(
  compile: (schemas: Schema[]) => Promise<CreatableValidator>,
  createIdFactory = defaultCreateIdFactory
) {
  return async (schema: object) => {
    const patch = insertSubSchemaIds(schema, {
      createId: createIdFactory(),
      fieldsValidationMode: ON_EVERYTHING,
    });
    return {
      schema: patch.schema,
      validator: await compile(fragmentSchema(patch)),
    };
  };
}

const DRAFT_07: Schema = { $schema: "http://json-schema.org/draft-07/schema" };

let esbuildInitPromise: Promise<void> | undefined;

const PRECOMPILED: Record<
  Extract<PlaygroundValidator, Precompiled<true>>["name"],
  ValidatorFactory
> = {
  ajv8: toPrecompiledFactory(async (schemas) => {
    await (esbuildInitPromise ??= initialize({
      wasmURL,
    }));
    const ajv = new Ajv({
      ...DEFAULT_AJV_CONFIG,
      schemas,
      code: {
        source: true,
        esm: true,
      },
    });
    const modules =
      // @ts-expect-error incompatible module resolution strategy
      standaloneCode(addFormComponents(addFormats(ajv)));
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
        resolveDir: "/",
        sourcefile: "input.js",
        loader: "js",
      },
    });
    const code = outputFiles[0]!.text;

    const validateFunctions = await importModule<AjvValidateFunctions>(code);
    return ajvFactory({
      validatorRetriever: fromValidators(validateFunctions),
    });
  }),
  ata: toPrecompiledFactory(async (schemas: Schema[]) => {
    const schemasWithBase = schemas.map((s) => Object.assign(s, DRAFT_07));
    const bundle = AtaValidator.bundleStandalone(schemasWithBase, {
      ...DEFAULT_ATA_OPTIONS,
      format: "esm",
    })
      .replace(
        "const validators",
        `export const [${schemasWithBase.map((s) => s.$id).join(", ")}]`
      )
      .slice(0, -50);
    const validateFunctions = await importModule<AtaValidateFunctions>(bundle);
    return ataFactory({
      validatorRetriever: fromValidators(validateFunctions),
    });
  }),
  hyperjump: toPrecompiledFactory(
    async (schemas: Schema[]) => {
      for (const schema of schemas) {
        registerSchema({
          ...DRAFT_07,
          ...schema,
        } as SchemaObject);
      }
      try {
        const ast = { metaData: {}, plugins: new Set() } as unknown as AST;
        for (const schema of schemas) {
          const s = await getSchema(schema.$id!);
          await Validation.compile(s, ast, s);
        }
        return hyperjumpFactory({
          localization,
          validatorRetriever: fromAst(ast),
        });
      } finally {
        for (const s of schemas) {
          unregisterSchema(s.$id!);
        }
      }
    },
    () => {
      let id = 0;
      return () => `https://example.com/v${id++}`;
    }
  ),
  schemasafe: toPrecompiledFactory(async (schemas: Schema[]) => {
    const validate = safeValidator(
      // @ts-expect-error Typings for `multi` version are missing
      schemas,
      {
        ...DEFAULT_SCHEMASAFE_OPTIONS,
        schemas: new Map(schemas.map((s) => [s.$id!, s])),
        multi: true,
      }
    );
    const code = `export const [${schemas.map((s) => s.$id).join(", ")}] = ${validate.toModule()}`;
    const validateFunctions =
      await importModule<SchemasafeValidateFunctions>(code);
    return schemasafeFactory({
      validatorRetriever: fromValidators(validateFunctions),
    });
  }),
};

export function playgroundValidator(validator: PlaygroundValidator) {
  const v = normalizeValidator(validator);
  if (v.precompiled) {
    return PRECOMPILED[v.name];
  }
  if (v.draft2020) {
    return DRAFT_2020[v.name];
  }
  return NORMAL[v.name];
}

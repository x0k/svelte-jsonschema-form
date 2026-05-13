import type { FormValue, Schema, SchemaValue } from "@sjsf/form";
import { createValidatorRetriever } from "@sjsf/form/validators/precompile";
import {
  Validation,
  type AST,
  type CompiledSchema,
} from "@hyperjump/json-schema/experimental";
import {
  fromJs,
  type JsonNode,
} from "@hyperjump/json-schema/instance/experimental";
import {
  getErrors,
  type Localization,
  type Json as HyperjumpJson,
} from "@hyperjump/json-schema-errors";

import { JsonSchemaErrorsOutputPlugin } from "./output-plugin.js";

// TODO: Remove in v4
interface LegacyValidatorOptions {
  /** @deprecated use `validatorRetriever` instead */
  ast: AST;
  /** @deprecated use `validatorRetriever` instead */
  augmentSuffix?: string;
  validatorRetriever?: (schema: Schema) => CompiledSchema;
}

interface ModernValidatorOptions {
  validatorRetriever: (schema: Schema) => CompiledSchema;
}

export type CoreValidatorOptions = (
  | LegacyValidatorOptions
  | ModernValidatorOptions
) & {
  localization: Localization;
};

// TODO: Remove in v4
export function createRetriever(options: CoreValidatorOptions) {
  return "ast" in options
    ? (options.validatorRetriever ??
        createValidatorRetriever({
          registry: {
            get: (id) => {
              const schemaUri = `${id}#`;
              return schemaUri in options.ast
                ? {
                    schemaUri,
                    ast: options.ast,
                  }
                : undefined;
            },
          },
          idAugmentations: options.augmentSuffix
            ? {
                combination: (id) => id + options.augmentSuffix,
              }
            : undefined,
        }))
    : options.validatorRetriever;
}

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => SchemaValue;
}

export type ValidatorOptions = CoreValidatorOptions & ValueToJSON;

export interface Context extends CompiledSchema {
  value: JsonNode;
}

export function createContext(
  options: ValidatorOptions,
  schema: Schema,
  value: FormValue,
): Context {
  const getCompiledSchema = createRetriever(options);
  return {
    ...getCompiledSchema(schema),
    value: fromJs(options.valueToJSON(value) as HyperjumpJson),
  };
}

export function validate(ctx: Context) {
  return Validation.interpret(ctx.schemaUri, ctx.value, {
    ast: ctx.ast,
    plugins: [...ctx.ast.plugins],
  });
}

export function evaluateCompiledSchema(
  ctx: Context,
  localization: Localization,
) {
  const outputPlugin = new JsonSchemaErrorsOutputPlugin();
  const context = {
    ast: ctx.ast,
    plugins: [...ctx.ast.plugins, outputPlugin],
  };
  const valid = Validation.interpret(ctx.schemaUri, ctx.value, context);
  return valid
    ? { valid }
    : {
        valid,
        errors: getErrors(
          outputPlugin.output,
          ctx.value,
          localization,
          ctx.ast,
        ),
      };
}

import type {
  Json as HyperjumpJson,
  ValidationOptions,
} from "@hyperjump/json-schema-errors";
import {
  Validation,
  type AST,
  type CompiledSchema,
} from "@hyperjump/json-schema/experimental";
import { fromJs } from "@hyperjump/json-schema/instance/experimental";
import type { FormValue, Schema, SchemaValue } from "@sjsf/form";
import {
  createValidatorRetriever,
  type ValidatorRetrieverOptions,
} from "@sjsf/form/validators/precompile";

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
) &
  Partial<ValidationOptions>;

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

export function fromAst(
  ast: AST,
  options?: Partial<Omit<ValidatorRetrieverOptions<any>, "registry">>
) {
  return createValidatorRetriever({
    registry: {
      get(id) {
        const schemaUri = `${id}#`;
        return schemaUri in ast
          ? {
              schemaUri,
              ast,
            }
          : undefined;
      },
    },
    ...options,
  });
}

export interface Context {
  compiledSchema: CompiledSchema;
  value: HyperjumpJson;
}

export function createContext(
  options: ValidatorOptions,
  schema: Schema,
  value: FormValue
): Context {
  const getCompiledSchema = createRetriever(options);
  return {
    compiledSchema: getCompiledSchema(schema),
    value: options.valueToJSON(value) as HyperjumpJson,
  };
}

export function validate({ compiledSchema, value }: Context) {
  return Validation.interpret(compiledSchema.schemaUri, fromJs(value), {
    ast: compiledSchema.ast,
    plugins: [...compiledSchema.ast.plugins],
  });
}

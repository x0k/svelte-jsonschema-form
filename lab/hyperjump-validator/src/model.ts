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

export type CoreValidatorOptions = {
  validatorRetriever: (schema: Schema) => CompiledSchema;
} & Partial<ValidationOptions>;

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => SchemaValue;
}

export type ValidatorOptions = CoreValidatorOptions & ValueToJSON;

export interface SchemaProvider {
  schema: Schema;
}

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
  return {
    compiledSchema: options.validatorRetriever(schema),
    value: options.valueToJSON(value) as HyperjumpJson,
  };
}

export function validate({ compiledSchema, value }: Context) {
  return Validation.interpret(compiledSchema.schemaUri, fromJs(value), {
    ast: compiledSchema.ast,
    plugins: [...compiledSchema.ast.plugins],
  });
}

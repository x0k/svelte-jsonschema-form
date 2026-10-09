import type { ValidationOptions, Validator } from "@hyperjump/json-schema";
import { JSE, type Json as HyperjumpJson } from "@hyperjump/json-schema-errors";
import type { FormValue, Schema, SchemaValue } from "@sjsf/form";

export interface CoreValidatorOptions extends Partial<ValidationOptions> {
  validatorRetriever: (schema: Schema) => Validator;
}

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => SchemaValue;
}

export type ValidatorOptions = CoreValidatorOptions & ValueToJSON;

export interface Context {
  validator: Validator;
  value: HyperjumpJson;
}

export function createContext(
  options: ValidatorOptions,
  schema: Schema,
  value: FormValue
): Context {
  return {
    validator: options.validatorRetriever(schema),
    value: options.valueToJSON(value) as HyperjumpJson,
  };
}

export function validate({ validator, value }: Context) {
  return validator(value).valid;
}

export function evaluate(
  { validator, value }: Context,
  options?: Partial<Pick<ValidationOptions, "locale" | "plugins">>
) {
  return validator(value, {
    outputFormat: JSE,
    locale: options?.locale,
    plugins: options?.plugins,
  });
}

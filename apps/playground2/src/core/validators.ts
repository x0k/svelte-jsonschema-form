import { ROOT_SCHEMA_PREFIX } from "@sjsf/form/core";
import {
  addFormComponents,
  createFormValidator as ajv8,
} from "@sjsf/ajv8-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import {
  DEFAULT_VALIDATOR_OPTIONS,
  createFormValidator as schemasafe,
} from "@sjsf/schemasafe-validator";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  Validator as CfValidator,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import {
  validator as safeValidator,
  type Schema as SafeSchema,
} from "@exodus/schemasafe";

export const validators = {
  ajv8: <T>(options: Parameters<typeof ajv8>[0]) =>
    ajv8<T>({
      ...options,
      ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
    }),
  ajv8_2020: <T>(options: Parameters<typeof ajv8>[0]) =>
    ajv8<T>({
      ...options,
      Ajv: Ajv2020,
      ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
    }),
  cfworker,
  cfworker_2020: <T>(options: Parameters<typeof cfworker>[0]) =>
    cfworker<T>({
      ...options,
      factory: (schema) =>
        new CfValidator(schema as CfSchema, "2020-12", false),
    }),
  schemasafe,
  schemasafe_2020: <T>(options: Parameters<typeof schemasafe>[0]) =>
    schemasafe<T>({
      ...options,
      factory: (schema, rootSchema) =>
        safeValidator(schema as SafeSchema, {
          ...DEFAULT_VALIDATOR_OPTIONS,
          $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
          schemas: {
            [ROOT_SCHEMA_PREFIX]: rootSchema as SafeSchema,
          },
        }),
    }),
  zod4: ajv8,
  valibot: ajv8,
};

export type Validator = keyof typeof validators;

export const REAL_VALIDATORS = (Object.keys(validators) as Validator[]).filter(
  (k) => k === "ajv8" || validators[k] !== validators.ajv8,
);

export const VALIDATOR_TITLES: Record<Validator, string> = {
  ajv8: "Ajv",
  ajv8_2020: "Ajv (2020-12)",
  cfworker: "@cfworker/json-schema",
  cfworker_2020: "@cfworker/json-schema (2020-12)",
  schemasafe: "@exodus/schemasafe",
  schemasafe_2020: "@exodus/schemasafe (2020-12)",
  zod4: "Ajv",
  valibot: "Ajv",
};

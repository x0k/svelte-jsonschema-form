import ajv8Package from "@sjsf/ajv8-validator/package.json" with { type: "json" };
import cfworkerPackage from "@sjsf/cfworker-validator/package.json" with { type: "json" };
import schemasafePackage from "@sjsf/schemasafe-validator/package.json" with { type: "json" };
import zod4Package from "@sjsf/zod4-validator/package.json" with { type: "json" };
import valibotPackage from "@sjsf/valibot-validator/package.json" with { type: "json" };

import type { Package } from "./package.js";

const JSON_SCHEMA_VALIDATORS = ["ajv8", "cfworker", "schemasafe"] as const;

const JSON_SCHEMA_VALIDATORS_SET = new Set<string>(JSON_SCHEMA_VALIDATORS);

export type JsonSchemaValidator = (typeof JSON_SCHEMA_VALIDATORS)[number];

const SCHEMA_VALIDATORS = ["zod4", "valibot"] as const;

export type SchemaValidator = (typeof SCHEMA_VALIDATORS)[number];

const INTERNAL_VALIDATORS = ["standard-schema", "noop"] as const;

export type InternalValidator = (typeof INTERNAL_VALIDATORS)[number];

const INTERNAL_VALIDATORS_SET = new Set<string>(INTERNAL_VALIDATORS);

const VALIDATORS = [
  ...JSON_SCHEMA_VALIDATORS,
  ...SCHEMA_VALIDATORS,
  ...INTERNAL_VALIDATORS,
];

export type Validator =
  | JsonSchemaValidator
  | SchemaValidator
  | InternalValidator;

export type ExternalValidator = Exclude<Validator, InternalValidator>;

const VALIDATOR_TITLES: Record<Validator, string> = {
  ajv8: "Ajv v8",
  cfworker: "@cfworker/json-schema",
  schemasafe: "@exodus/schemasafe",
  noop: "noop",
  "standard-schema": "Standard Schema",
  valibot: "Valibot",
  zod4: "Zod v4",
};

const EXTERNAL_VALIDATOR_PACKAGES = {
  ajv8: ajv8Package,
  cfworker: cfworkerPackage,
  schemasafe: schemasafePackage,
  valibot: valibotPackage,
  zod4: zod4Package,
} satisfies Record<ExternalValidator, Package>;

export function validators(): Validator[] {
  return VALIDATORS;
}

export function validatorTitle(validator: Validator) {
  return VALIDATOR_TITLES[validator];
}

export function isJsonSchemaValidator(
  validator: string,
): validator is JsonSchemaValidator {
  return JSON_SCHEMA_VALIDATORS_SET.has(validator);
}

function isInternalValidator(
  validator: string,
): validator is InternalValidator {
  return INTERNAL_VALIDATORS_SET.has(validator);
}

export function validatorPackage(validator: Validator) {
  if (isInternalValidator(validator)) {
    return `@sjsf/form/validators/${validator}`;
  }
  return `@sjsf/${validator}-validator`;
}

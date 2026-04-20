import _ajv8PackageJson from "@sjsf/ajv8-validator/package.json" with { type: "json" };
import _cfworkerPackageJson from "@sjsf/cfworker-validator/package.json" with { type: "json" };
import _schemasafePackageJson from "@sjsf/schemasafe-validator/package.json" with { type: "json" };
import _zod4PackageJson from "@sjsf/zod4-validator/package.json" with { type: "json" };
import _valibotPackageJson from "@sjsf/valibot-validator/package.json" with { type: "json" };

import { type Package, fromPackageJson } from "./package.ts";
import { formPackage } from "./form.ts";

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
  ajv8: fromPackageJson(_ajv8PackageJson),
  cfworker: fromPackageJson(_cfworkerPackageJson),
  schemasafe: fromPackageJson(_schemasafePackageJson),
  valibot: fromPackageJson(_valibotPackageJson),
  zod4: fromPackageJson(_zod4PackageJson),
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

export function isInternalValidator(
  validator: string,
): validator is InternalValidator {
  return INTERNAL_VALIDATORS_SET.has(validator);
}

export function externalValidatorPackage(
  validator: ExternalValidator,
): Package {
  return EXTERNAL_VALIDATOR_PACKAGES[validator];
}

export function internalValidatorSubPath(validator: InternalValidator) {
  return `${formPackage.name}/validators/${validator}`;
}

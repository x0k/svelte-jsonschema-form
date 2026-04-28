import _ajv8PackageJson from "@sjsf/ajv8-validator/package.json" with { type: "json" };
import _cfworkerPackageJson from "@sjsf/cfworker-validator/package.json" with { type: "json" };
import _schemasafePackageJson from "@sjsf/schemasafe-validator/package.json" with { type: "json" };
import _zod4PackageJson from "@sjsf/zod4-validator/package.json" with { type: "json" };
import _valibotPackageJson from "@sjsf/valibot-validator/package.json" with { type: "json" };
import _hyperjumpPackageJson from "@sjsf-lab/hyperjump-validator/package.json" with { type: "json" };

import { type Package, fromPackageJson } from "./package.ts";
import { formPackage } from "./form.ts";

const VALIDATORS = [
  "ajv8",
  "cfworker",
  "schemasafe",
  "zod4",
  "valibot",
  "hyperjump",
  "standard-schema",
  "noop",
] as const;

export type Validator = (typeof VALIDATORS)[number];

const JSON_SCHEMA_VALIDATORS = [
  "ajv8",
  "cfworker",
  "schemasafe",
] satisfies Validator[];

const JSON_SCHEMA_VALIDATORS_SET = new Set<string>(JSON_SCHEMA_VALIDATORS);

export type JsonSchemaValidator = (typeof JSON_SCHEMA_VALIDATORS)[number];

const SCHEMA_VALIDATORS = [
  "zod4",
  "valibot",
  "standard-schema",
] satisfies Validator[];

const SCHEMA_VALIDATORS_SET = new Set<string>(SCHEMA_VALIDATORS);

export type SchemaValidator = (typeof SCHEMA_VALIDATORS)[number];

const PRECOMPILED_VALIDATORS = [
  "hyperjump",
  "ajv8",
  "schemasafe",
] satisfies Validator[];

const PRECOMPILED_VALIDATORS_SET = new Set<string>(PRECOMPILED_VALIDATORS);

export type PrecompiledValidator = (typeof PRECOMPILED_VALIDATORS)[number];

const PRECOMPILED_ONLY_VALIDATORS = ["hyperjump"] satisfies Validator[];

const PRECOMPILED_ONLY_VALIDATORS_SET = new Set<string>(
  PRECOMPILED_ONLY_VALIDATORS,
);

export type PrecompiledOnlyValidator =
  (typeof PRECOMPILED_ONLY_VALIDATORS)[number];

const LAB_VALIDATORS = ["hyperjump"] satisfies Validator[];

export type LabValidator = (typeof LAB_VALIDATORS)[number];

const INTERNAL_VALIDATORS = ["standard-schema", "noop"] as const;

export type InternalValidator = (typeof INTERNAL_VALIDATORS)[number];

const INTERNAL_VALIDATORS_SET = new Set<string>(INTERNAL_VALIDATORS);

export type ExternalValidator = Exclude<Validator, InternalValidator>;

const VALIDATOR_TITLES: Record<Validator, string> = {
  ajv8: "Ajv v8",
  cfworker: "@cfworker/json-schema",
  schemasafe: "@exodus/schemasafe",
  noop: "noop",
  "standard-schema": "Standard Schema",
  valibot: "Valibot",
  zod4: "Zod v4",
  hyperjump: "@hyperjump/json-schema",
};

const EXTERNAL_VALIDATOR_PACKAGES = {
  ajv8: fromPackageJson(_ajv8PackageJson),
  cfworker: fromPackageJson(_cfworkerPackageJson),
  schemasafe: fromPackageJson(_schemasafePackageJson),
  valibot: fromPackageJson(_valibotPackageJson),
  zod4: fromPackageJson(_zod4PackageJson),
  hyperjump: fromPackageJson(_hyperjumpPackageJson),
} satisfies Record<ExternalValidator, Package>;

export function validators(): Iterable<Validator> {
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

export function isSchemaValidator(
  validator: string,
): validator is SchemaValidator {
  return SCHEMA_VALIDATORS_SET.has(validator);
}

export function isInternalValidator(
  validator: string,
): validator is InternalValidator {
  return INTERNAL_VALIDATORS_SET.has(validator);
}

export function isPrecompiledValidator(
  validator: string,
): validator is PrecompiledValidator {
  return PRECOMPILED_VALIDATORS_SET.has(validator);
}

export function isPrecompiledOnlyValidator(
  validator: string,
): validator is PrecompiledOnlyValidator {
  return PRECOMPILED_ONLY_VALIDATORS_SET.has(validator);
}

export function externalValidatorPackage(
  validator: ExternalValidator,
): Package {
  return EXTERNAL_VALIDATOR_PACKAGES[validator];
}

export function internalValidatorSubPath(validator: InternalValidator) {
  return `${formPackage.name}/validators/${validator}`;
}

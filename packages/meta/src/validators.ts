import _ajv8PackageJson from "@sjsf/ajv8-validator/package.json" with { type: "json" };
import _cfworkerPackageJson from "@sjsf/cfworker-validator/package.json" with { type: "json" };
import _schemasafePackageJson from "@sjsf/schemasafe-validator/package.json" with { type: "json" };
import _zod4PackageJson from "@sjsf/zod4-validator/package.json" with { type: "json" };
import _valibotPackageJson from "@sjsf/valibot-validator/package.json" with { type: "json" };
import _hyperjumpPackageJson from "@sjsf-lab/hyperjump-validator/package.json" with { type: "json" };
import _ataPackageJson from "@sjsf-lab/ata-validator/package.json" with { type: "json" };

import { type Package, fromPackageJson } from "./package.ts";
import { formPackage } from "./form.ts";

const VALIDATORS = [
  "ajv8",
  "cfworker",
  "schemasafe",
  "zod4",
  "valibot",
  "ata",
  "hyperjump",
  "standard-schema",
  "noop",
] as const;

const VALIDATORS_SET = new Set<string>(VALIDATORS);

export type Validator = (typeof VALIDATORS)[number];

const JSON_SCHEMA_VALIDATORS = [
  "ajv8",
  "cfworker",
  "schemasafe",
  "hyperjump",
  "ata",
] satisfies Validator[];

const JSON_SCHEMA_VALIDATORS_SET = new Set<Validator>(JSON_SCHEMA_VALIDATORS);

export type JsonSchemaValidator = (typeof JSON_SCHEMA_VALIDATORS)[number];

const SCHEMA_VALIDATORS = [
  "zod4",
  "valibot",
  "standard-schema",
] satisfies Validator[];

const SCHEMA_VALIDATORS_SET = new Set<Validator>(SCHEMA_VALIDATORS);

export type SchemaValidator = (typeof SCHEMA_VALIDATORS)[number];

const PRECOMPILED_VALIDATORS = [
  "hyperjump",
  "ajv8",
  "schemasafe",
  "ata",
] satisfies Validator[];

const PRECOMPILED_VALIDATORS_SET = new Set<Validator>(PRECOMPILED_VALIDATORS);

export type PrecompiledValidator = (typeof PRECOMPILED_VALIDATORS)[number];

const PRECOMPILED_ONLY_VALIDATORS = [
  "hyperjump",
] satisfies PrecompiledValidator[];

const PRECOMPILED_ONLY_VALIDATORS_SET = new Set<Validator>(
  PRECOMPILED_ONLY_VALIDATORS,
);

export type PrecompiledOnlyValidator =
  (typeof PRECOMPILED_ONLY_VALIDATORS)[number];

const LAB_VALIDATORS = ["ata", "hyperjump"] satisfies Validator[];

const LAB_VALIDATORS_SET = new Set<Validator>(LAB_VALIDATORS);

export type LabValidator = (typeof LAB_VALIDATORS)[number];

const INTERNAL_VALIDATORS = ["standard-schema", "noop"] as const;

const INTERNAL_VALIDATORS_SET = new Set<Validator>(INTERNAL_VALIDATORS);

export type InternalValidator = (typeof INTERNAL_VALIDATORS)[number];

const INTERNAL_VALIDATOR_MODULES = ["precompile"] as const;

export type InternalValidatorModule =
  (typeof INTERNAL_VALIDATOR_MODULES)[number];

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
  ata: "ata-validator",
};

const EXTERNAL_VALIDATOR_PACKAGES = {
  ajv8: fromPackageJson(_ajv8PackageJson),
  cfworker: fromPackageJson(_cfworkerPackageJson),
  schemasafe: fromPackageJson(_schemasafePackageJson),
  valibot: fromPackageJson(_valibotPackageJson),
  zod4: fromPackageJson(_zod4PackageJson),
  hyperjump: fromPackageJson(_hyperjumpPackageJson),
  ata: fromPackageJson(_ataPackageJson),
} satisfies Record<ExternalValidator, Package>;

export function validators(): Iterable<Validator> {
  return VALIDATORS;
}

export function validatorTitle(validator: Validator) {
  return VALIDATOR_TITLES[validator];
}

export function isValidator(v: string): v is Validator {
  return VALIDATORS_SET.has(v);
}

export function isJsonSchemaValidator(
  validator: Validator,
): validator is JsonSchemaValidator {
  return JSON_SCHEMA_VALIDATORS_SET.has(validator);
}

export function isSchemaValidator(
  validator: Validator,
): validator is SchemaValidator {
  return SCHEMA_VALIDATORS_SET.has(validator);
}

export function isInternalValidator(
  validator: Validator,
): validator is InternalValidator {
  return INTERNAL_VALIDATORS_SET.has(validator);
}

export function isPrecompiledValidator(
  validator: Validator,
): validator is PrecompiledValidator {
  return PRECOMPILED_VALIDATORS_SET.has(validator);
}

export function isPrecompiledOnlyValidator(
  validator: Validator,
): validator is PrecompiledOnlyValidator {
  return PRECOMPILED_ONLY_VALIDATORS_SET.has(validator);
}

export function isLabValidator(
  validator: Validator,
): validator is LabValidator {
  return LAB_VALIDATORS_SET.has(validator);
}

export function externalValidatorPackage(
  validator: ExternalValidator,
): Package {
  return EXTERNAL_VALIDATOR_PACKAGES[validator];
}

export function internalValidatorSubPath(
  validator: InternalValidator | InternalValidatorModule,
) {
  return `${formPackage.name}/validators/${validator}`;
}

export function precompiledValidatorSubPath(validator: PrecompiledValidator) {
  return `${externalValidatorPackage(validator).name}/precompile`;
}

const HYPERJUMP_LOCALES = ["en-us"] as const;

type HyperjumpLocale = (typeof HYPERJUMP_LOCALES)[number];

export function hyperjumpValidatorLocalizationSubPath(locale: HyperjumpLocale) {
  return `${externalValidatorPackage("hyperjump").name}/localizations/${locale}`;
}

const ZOD4_VERSIONS = ["classic", "mini"] as const;

type Zod4Version = (typeof ZOD4_VERSIONS)[number];

export function zod4ValidatorVersionSubPath(v: Zod4Version) {
  return `${externalValidatorPackage("zod4").name}/${v}`;
}

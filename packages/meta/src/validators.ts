export const JSON_SCHEMA_VALIDATORS = [
  "ajv8",
  "cfworker",
  "schemasafe",
] as const;

export type JsonSchemaValidator = (typeof JSON_SCHEMA_VALIDATORS)[number];

export const SCHEMA_VALIDATORS = ["zod4", "valibot"] as const;

export type SchemaValidator = (typeof SCHEMA_VALIDATORS)[number];

export const INTERNAL_VALIDATORS = ["noop", "standard-schema"] as const;

export type InternalValidator = (typeof INTERNAL_VALIDATORS)[number];

const INTERNAL_VALIDATORS_SET = new Set<string>(INTERNAL_VALIDATORS);

function isInternalValidator(
  validator: string,
): validator is InternalValidator {
  return INTERNAL_VALIDATORS_SET.has(validator);
}

export type Validator =
  | JsonSchemaValidator
  | SchemaValidator
  | InternalValidator;

export type ExternalValidator = Exclude<Validator, InternalValidator>;

export const VALIDATOR_TITLES: Record<Validator, string> = {
  ajv8: "Ajv v8",
  cfworker: "@cfworker/json-schema",
  schemasafe: "@exodus/schemasafe",
  noop: "noop",
  "standard-schema": "Standard Schema",
  valibot: "Valibot",
  zod4: "Zod v4",
};

export function validatorPackage(validator: Validator) {
  if (isInternalValidator(validator)) {
    return `@sjsf/form/validators/${validator}`;
  }
  return `@sjsf/${validator}-validator`;
}

export const VALIDATOR_DEPENDENCIES: Record<
  ExternalValidator,
  Record<string, string>
> = {
  ajv8: { ajv: "^8.17.0" },
  cfworker: {
    "@cfworker/json-schema": "^4.1.0",
  },
  schemasafe: {
    "@exodus/schemasafe": "^1.3.0",
  },
  zod4: { zod: "^4.1.0" },
  valibot: {
    valibot: "^1.1.0",
    "@valibot/to-json-schema": "^1.3.0",
  },
};

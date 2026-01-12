import { createFormValidator as ajv8 } from "@sjsf/ajv8-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import { createFormValidator as schemasafe } from "@sjsf/schemasafe-validator";

export const validators = {
  ajv8,
  cfworker,
  schemasafe,
  zod4: ajv8,
  valibot: ajv8,
};

type Validator = keyof typeof validators;

export const REAL_VALIDATORS = (Object.keys(validators) as Validator[]).filter(
  (k) => k === "ajv8" || validators[k] !== validators.ajv8
);

export const VALIDATOR_TITLES: Record<Validator, string> = {
  ajv8: "Ajv",
  cfworker: "@exodus/schemasafe",
  schemasafe: "@cfworker/json-schema",
  zod4: "Ajv",
  valibot: "Ajv",
};

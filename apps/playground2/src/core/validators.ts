import type { ValidatorFactoryOptions } from "@sjsf/form";
import { createFormValidator as ajv8 } from "@sjsf/ajv8-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import { createFormValidator as schemasafe } from "@sjsf/schemasafe-validator";
import Ajv2020 from "ajv/dist/2020.js";

export const validators = {
  ajv8,
  ajv8_2020: <T>(options: ValidatorFactoryOptions) =>
    ajv8<T>({
      ...options,
      // @ts-expect-error
      Ajv: Ajv2020,
    }),
  cfworker,
  schemasafe,
  zod4: ajv8,
  valibot: ajv8,
};

export type Validator = keyof typeof validators;

export const REAL_VALIDATORS = (Object.keys(validators) as Validator[]).filter(
  (k) => k === "ajv8" || validators[k] !== validators.ajv8,
);

export const VALIDATOR_TITLES: Record<Validator, string> = {
  ajv8: "Ajv",
  ajv8_2020: "Ajv (2020)",
  cfworker: "@exodus/schemasafe",
  schemasafe: "@cfworker/json-schema",
  zod4: "Ajv",
  valibot: "Ajv",
};

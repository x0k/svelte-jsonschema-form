import type { Validator as SJSFValidator } from "@sjsf/form";

import { createFormValidator as ajv } from "@sjsf/ajv8-validator";
import { createFormValidator as schemasafe } from "@sjsf/schemasafe-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";

export enum Validator {
  Ajv = "ajv8",
  SchemaSafe = "schemasafe",
  CfWorker = "cfworker",
}

export const VALIDATORS = Object.values(Validator);

export const SJSF_VALIDATORS: Record<Validator, SJSFValidator> = {
  [Validator.Ajv]: ajv(),
  [Validator.SchemaSafe]: schemasafe(),
  [Validator.CfWorker]: cfworker(),
};

export const VALIDATOR_TITLES: Record<Validator, string> = {
  [Validator.Ajv]: "Ajv",
  [Validator.SchemaSafe]: "@exodus/schemasafe",
  [Validator.CfWorker]: "@cfworker/json-schema",
};

export const VALIDATOR_PEER_DEPS: Record<Validator, string> = {
  [Validator.Ajv]: "ajv",
  [Validator.SchemaSafe]: "@exodus/schemasafe",
  [Validator.CfWorker]: "@cfworker/json-schema",
}
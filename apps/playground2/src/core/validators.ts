import { createFormValidator as ajv8 } from "@sjsf/ajv8-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import { createFormValidator as schemasafe } from "@sjsf/schemasafe-validator";

export const validators = {
  ajv8,
  cfworker,
  schemasafe,
};

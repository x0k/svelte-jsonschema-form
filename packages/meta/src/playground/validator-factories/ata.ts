import {
  createFormValidator,
  DEFAULT_VALIDATOR_OPTIONS as DEFAULT_ATA_OPTIONS,
} from "@sjsf-lab/ata-validator";
import { Validator as AtaValidator } from "ata-validator";

import type { CreatableValidator } from "../validator-factory.ts";

export const draft07: CreatableValidator = (options) =>
  createFormValidator(options);

export const draft2020: CreatableValidator = (options) =>
  createFormValidator({
    ...options,
    factory: (schema) => new AtaValidator(schema, DEFAULT_ATA_OPTIONS),
  });

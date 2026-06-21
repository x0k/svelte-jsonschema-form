import { DEFAULT_VALIDATOR_OPTIONS as DEFAULT_ATA_OPTIONS } from "@sjsf-lab/ata-validator";
import {
  createFormValidatorFactory as ataFactory,
  type ValidateFunctions as AtaValidateFunctions,
} from "@sjsf-lab/ata-validator/precompile";
import { type Schema } from "@sjsf/form";
import { fromValidators } from "@sjsf/form/validators/precompile";
import { Validator as AtaValidator } from "ata-validator";

import { importModule } from "../../modules.ts";
import { DRAFT_07 } from "../validator-factory.ts";
import type { CompileValidator } from "../validator-factory.ts";

export const draft07: CompileValidator = async (schemas: Schema[]) => {
  const schemasWithBase = schemas.map((s) => Object.assign(s, DRAFT_07));
  const bundle = AtaValidator.bundleStandalone(schemasWithBase, {
    ...DEFAULT_ATA_OPTIONS,
    format: "esm",
  })
    .replace(
      "const validators",
      `export const [${schemasWithBase.map((s) => s.$id).join(", ")}]`
    )
    .slice(0, -50);
  const validateFunctions = await importModule<AtaValidateFunctions>(bundle);
  return ataFactory({
    validatorRetriever: fromValidators(validateFunctions),
  });
};

export const draft2020: CompileValidator = async (schemas: Schema[]) => {
  const bundle = AtaValidator.bundleStandalone(schemas, {
    ...DEFAULT_ATA_OPTIONS,
    format: "esm",
  })
    .replace(
      "const validators",
      `export const [${schemas.map((s) => s.$id).join(", ")}]`
    )
    .slice(0, -50);
  const validateFunctions = await importModule<AtaValidateFunctions>(bundle);
  return ataFactory({
    validatorRetriever: fromValidators(validateFunctions),
  });
};

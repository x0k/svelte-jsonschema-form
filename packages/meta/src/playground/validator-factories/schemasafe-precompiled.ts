import { validator as safeValidator } from "@exodus/schemasafe";
import { type Schema } from "@sjsf/form";
import { fromValidators } from "@sjsf/form/validators/precompile";
import { DEFAULT_VALIDATOR_OPTIONS as DEFAULT_SCHEMASAFE_OPTIONS } from "@sjsf/schemasafe-validator";
import {
  createFormValidatorFactory as schemasafeFactory,
  type ValidateFunctions as SchemasafeValidateFunctions,
} from "@sjsf/schemasafe-validator/precompile";

import { importModule } from "../../modules.ts";
import type { CompileValidator } from "../validator-factory.ts";

export const draft07: CompileValidator = async (schemas: Schema[]) => {
  const validate = safeValidator(
    // @ts-expect-error Typings for `multi` version are missing
    schemas,
    {
      ...DEFAULT_SCHEMASAFE_OPTIONS,
      schemas: new Map(schemas.map((s) => [s.$id!, s])),
      multi: true,
    }
  );
  const code = `export const [${schemas.map((s) => s.$id).join(", ")}] = ${validate.toModule()}`;
  const validateFunctions =
    await importModule<SchemasafeValidateFunctions>(code);
  return schemasafeFactory({
    validatorRetriever: fromValidators(validateFunctions),
  });
};

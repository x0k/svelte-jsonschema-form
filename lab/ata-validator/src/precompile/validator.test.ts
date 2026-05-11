import {
  fragmentSchema,
  fromValidators,
  insertSubSchemaIds,
} from "@sjsf/form/validators/precompile";
import { Validator } from "ata-validator";
import { formValueValidatorTests, importModule } from "validator-testing";

import { DEFAULT_VALIDATOR_OPTIONS } from "../validator.svelte.js";
import {
  createFormValidatorFactory,
  type ValidateFunctions,
} from "./validator.svelte.js";

formValueValidatorTests((options) => ({
  isValid: () => {
    throw new Error("'isValid' is not implemented");
  },
  async validateFormValueAsync(_signal, rootSchema, formValue) {
    const patch = insertSubSchemaIds(rootSchema);
    const base = { $schema: "http://json-schema.org/draft-07/schema" };
    const schemas = fragmentSchema(patch);
    const bundle = Validator.bundleStandalone(
      schemas.map((s) => Object.assign(s, base)),
      { ...DEFAULT_VALIDATOR_OPTIONS, format: "esm" },
    )
      .replace(
        "const validators",
        `export const [${schemas.map((s) => s.$id).join(", ")}]`,
      )
      .slice(0, -50);
    const validateFunctions = await importModule<ValidateFunctions>(bundle);
    const factory = createFormValidatorFactory({
      validatorRetriever: fromValidators(validateFunctions),
    });
    const v = factory(options);
    return v.validateFormValue(patch.schema, formValue);
  },
}));

import {
  fragmentSchema,
  fromValidators,
} from "@sjsf/form/validators/precompile";
import { Validator } from "ata-validator";
import {
  createPrecompiledValidatorFactory,
  formValueValidatorTests,
  importModule,
  validatorTests,
} from "validator-testing";

import { DEFAULT_VALIDATOR_OPTIONS } from "../validator.svelte.js";
import {
  createFormValidatorFactory,
  type ValidateFunctions,
} from "./validator.svelte.js";

const createFormValidator = createPrecompiledValidatorFactory(
  async (options) => {
    const base = { $schema: "http://json-schema.org/draft-07/schema" };
    const schemas = fragmentSchema(options.patch).map((s) =>
      Object.assign(s, base),
    );
    const bundle = Validator.bundleStandalone(schemas, {
      ...DEFAULT_VALIDATOR_OPTIONS,
      format: "esm",
    })
      .replace(
        "const validators",
        `export const [${schemas.map((s) => s.$id).join(", ")}]`,
      )
      .slice(0, -50);
    const validateFunctions = await importModule<ValidateFunctions>(bundle);
    const factory = createFormValidatorFactory({
      validatorRetriever: fromValidators(validateFunctions),
    });
    return factory(options);
  },
);

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator);

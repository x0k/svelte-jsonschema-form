import {
  fragmentSchema,
  fromValidators,
  insertSubSchemaIds,
} from "@sjsf/form/validators/precompile";
import {
  createPrecompiledValidatorFactory,
  formValueValidatorTests,
  importModule,
  validatorTests,
} from "validator-testing";
import { validator } from "@exodus/schemasafe";

import { DEFAULT_VALIDATOR_OPTIONS } from "../model.js";
import {
  createFormValidatorFactory,
  type ValidateFunctions,
} from "./validator.js";

const createFormValidator = createPrecompiledValidatorFactory(
  async (options) => {
    const patch = insertSubSchemaIds(options.schema);
    const schemas = fragmentSchema(patch);
    const validate = validator(
      // @ts-expect-error Typings for `multi` version are missing
      schemas,
      {
        ...DEFAULT_VALIDATOR_OPTIONS,
        schemas: new Map(schemas.map((s) => [s.$id, s])),
        multi: true,
      },
    );
    const code = `export const [${schemas.map((s) => s.$id).join(", ")}] = ${validate.toModule()}`;
    const validateFunctions = await importModule<ValidateFunctions>(code);
    const factory = createFormValidatorFactory({
      validatorRetriever: fromValidators(validateFunctions),
    });
    return factory(options);
  },
);

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator);

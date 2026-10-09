import {
  registerSchema,
  restoreValidator,
  unregisterSchema,
  validate,
  type SchemaObject,
  type Validator,
} from "@hyperjump/json-schema/draft-07";
import {
  fragmentSchema,
  fromValidators,
  type IdFactory,
} from "@sjsf/form/validators/precompile";
import {
  createPrecompiledValidatorFactory,
  formValueValidatorTests,
  validatorTests,
} from "validator-testing";

import { createFormValidatorFactory } from "./validator.js";

const toId = (n: number) => `https://example.com/v${n}`;
const createIdFactory = (): IdFactory => {
  let id = 0;
  return () => toId(id++);
};

const createFormValidator = createPrecompiledValidatorFactory(
  async (options) => {
    const schemas = fragmentSchema(options.patch);
    for (const schema of schemas) {
      registerSchema(
        Object.assign(
          { $schema: "http://json-schema.org/draft-07/schema" },
          schema as SchemaObject
        )
      );
    }
    try {
      const validators: Record<string, Validator> = {};
      for (const schema of schemas) {
        const validator = await validate(schema.$id!);
        validators[schema.$id!] = restoreValidator(validator.serialize());
      }
      const factory = createFormValidatorFactory({
        validatorRetriever: fromValidators(validators),
      });
      return factory(options);
    } finally {
      for (const s of schemas) {
        unregisterSchema(s.$id!);
      }
    }
  }
);

validatorTests(createFormValidator, { createIdFactory });
formValueValidatorTests(createFormValidator, {
  createIdFactory,
  skipTitleResolutionTests: true,
});

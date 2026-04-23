import {
  fragmentSchema,
  insertSubSchemaIds,
} from "@sjsf/form/validators/precompile";
import { formValueValidatorTests, importModule } from "validator-testing";
import { validator } from "@exodus/schemasafe";

import { DEFAULT_VALIDATOR_OPTIONS } from "../model.js";
import {
  createFormValidatorFactory,
  type ValidateFunctions,
} from "./validator.js";

formValueValidatorTests((options) => ({
  isValid: () => {
    throw new Error("'isValid' is not implemented");
  },
  async validateFormValueAsync(_signal, rootSchema, formValue) {
    const patch = insertSubSchemaIds(rootSchema);
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
    const factory = createFormValidatorFactory({ validateFunctions });
    const v = factory(options);
    return v.validateFormValue(patch.schema, formValue);
  },
}));

import { validatorTests, formValueValidatorTests } from "validator-testing";
import { Ajv, type AsyncSchema } from "ajv";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "./model.js";
import { createAsyncFormValidator, createFormValidator } from "./validator.js";

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator);
formValueValidatorTests((options) => {
  const v = createAsyncFormValidator({
    ...options,
    ajv: addFormComponents(new Ajv({ ...DEFAULT_AJV_CONFIG })),
  });
  return {
    ...v,
    validateFormValueAsync(signal, rootSchema, formValue) {
      return v.validateFormValueAsync(
        signal,
        { ...rootSchema, $async: true } as AsyncSchema,
        formValue,
      );
    },
  };
});

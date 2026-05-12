import { validatorTests, formValueValidatorTests } from "validator-testing";

import { createFormValidator } from "./validator.svelte.js";

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator, {
  // NOTE: This is necessary due to a problem with
  // compiling the augmented schema
  useOriginalSchema: true,
});

import { validatorTests, formValueValidatorTests } from "validator-testing";

import { createFormValidator } from "./validator.svelte.js";

// NOTE: The following tweaks are necessary due to a problem with
// compiling the augmented schemas
validatorTests(createFormValidator, {
  useOriginalSchema: true,
});
formValueValidatorTests(createFormValidator, {
  useOriginalSchema: true,
});

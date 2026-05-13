import { validatorTests, formValueValidatorTests } from "validator-testing";

import { createFormValidator } from "./validator.svelte.js";

// NOTE: The following tweaks are necessary due to a problem with
// compiling the augmented schemas
// https://github.com/cfworker/cfworker/issues/335
validatorTests(createFormValidator, {
  useOriginalSchema: true,
});
formValueValidatorTests(createFormValidator, {
  useOriginalSchema: true,
});

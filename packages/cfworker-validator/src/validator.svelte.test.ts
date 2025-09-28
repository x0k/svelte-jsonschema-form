import { validatorTests, formValueValidatorTests } from "validator-testing";

import { createFormValidator } from "./validator.svelte.js";

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator);

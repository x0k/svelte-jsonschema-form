import { validatorTests, formValueValidatorTests } from "validator-testing";

import { createFormValidator } from "./validator.js";

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator);

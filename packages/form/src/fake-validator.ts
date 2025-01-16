import type { Validator } from "@/core/index.js";
import { makeTestValidator } from "@/core/test-validator.js";

import type { FormValidator2 } from "./form/validator.js";

export type ValidatorOptions = {
  validator?: Validator;
} & Partial<FormValidator2>;

export function createValidator({
  validator = makeTestValidator(),
  ...rest
}: ValidatorOptions = {}): FormValidator2 {
  return {
    isValid: validator.isValid.bind(validator),
    reset: validator.reset.bind(validator),
    validateFieldData(field, fieldData, signal) {
      return []
    },
    validateFormData(rootSchema, formData, signal) {
      return []
    },
    ...rest,
  };
}

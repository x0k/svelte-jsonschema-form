import type { Validator } from "./validator.js";

export function makeTestValidator({
  isValid = [],
}: { isValid?: boolean[] } = {}): Validator {
  const validator = {
    isValid() {
      if (isValid.length > 0) {
        return isValid.shift()!;
      }
      return true;
    },
    validateFormData() {
      return [];
    },
    reset() {},
  };
  return validator;
}

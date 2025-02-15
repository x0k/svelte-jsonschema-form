import type { Validator } from "./validator.js";

export function createValidator({
  isValid = [],
}: { isValid?: boolean[] } = {}): Validator {
  return {
    isValid() {
      if (isValid.length > 0) {
        return isValid.shift()!;
      }
      return true;
    },
  };
}

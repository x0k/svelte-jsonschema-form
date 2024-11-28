import { Validator, type ValidatorOptions } from "./validator.js";

export function createValidator(options: ValidatorOptions) {
  return new Validator(options);
}

import { Validator, type ValidatorOptions } from "./validator.js";

export function createValidator<Async extends boolean>(options: ValidatorOptions<Async>) {
  return new Validator(options);
}

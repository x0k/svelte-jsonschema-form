import { Validator, type ValidatorOptions } from "./validator.js";

export type ValidatorFactoryOptions<Async extends boolean> = Omit<ValidatorOptions<Async>, "async"> & {
  async?: Async
}

export function createValidator<Async extends boolean = false>(options: ValidatorFactoryOptions<Async>) {
  return new Validator({
    ...options,
    async: options.async ?? false
  });
}

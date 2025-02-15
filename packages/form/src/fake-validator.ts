import type { Validator } from "@/core/index.js";
import { createValidator as createTestValidator } from "@/core/test-validator.js";

import type { FormValidator } from "./form/validator.js";

export type ValidatorOptions<E> = {
  validator?: Validator;
} & Partial<FormValidator<E>>;

export function createValidator<E>({
  validator = createTestValidator(),
  ...rest
}: ValidatorOptions<E> = {}): FormValidator<E> {
  return {
    ...validator,
    ...rest
  };
}

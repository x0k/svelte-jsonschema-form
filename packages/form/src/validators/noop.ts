import type { FormValidator } from "@/form/validator.js";

export const createFormValidator = <T>() =>
  ({
    isValid: () => true,
    validateFormValue: (value) => {
      return { value: value as T };
    },
  }) satisfies FormValidator<T>;

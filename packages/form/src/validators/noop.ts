import type { FormValidator } from "@/form/validator.js";

export const createFormValidator = <I, O>() =>
  ({
    isValid: () => true,
    validateFormValue: (_, value) => {
      return { value: value as O };
    },
  }) satisfies FormValidator<I, O>;

import type { ErrorObject } from "ajv";
import { createFormValidator } from "@sjsf/ajv8-validator";
import { isSchemaObjectValue } from "@sjsf/form/core";
import { pathToId, type FormValueValidator } from "@sjsf/form";

class StarError {}

export function createValidator(idPrefix: string) {
  const validator = createFormValidator({ idPrefix });
  return {
    ...validator,
    validateFormValue(rootSchema, formValue) {
      const errors = validator.validateFormValue(rootSchema, formValue);
      return isSchemaObjectValue(formValue) && !formValue["star"]
        ? [
            ...errors,
            {
              instanceId: pathToId(["star"], { idPrefix }),
              propertyTitle: "Star",
              message: "That's okay, but I would appreciate your support!",
              error: new StarError(),
            },
          ]
        : errors;
    },
  } satisfies FormValueValidator<ErrorObject | StarError>;
}

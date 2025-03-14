import type { ErrorObject } from "ajv";
import { createFormValidator } from "@sjsf/ajv8-validator";
import { isSchemaObjectValue } from "@sjsf/form/core";
import {
  pathToId,
  type FormValueValidator,
  type ValidationError,
} from "@sjsf/form";

class StarError {}

function createStarValidator<V extends FormValueValidator<ErrorObject>>(
  v: V,
  idPrefix: string
) {
  return {
    ...v,
    validateFormValue(rootSchema, formValue) {
      const errors: ValidationError<ErrorObject | StarError>[] =
        v.validateFormValue(rootSchema, formValue);
      return isSchemaObjectValue(formValue) && !formValue["star"]
        ? errors.concat({
            instanceId: pathToId(["star"], { idPrefix }),
            propertyTitle: "Star",
            message: "That's okay, but I would appreciate your support!",
            error: new StarError(),
          })
        : errors;
    },
  } satisfies FormValueValidator<ErrorObject | StarError>;
}

export const createValidator = (idPrefix: string) =>
  createStarValidator(createFormValidator({ idPrefix }), idPrefix);

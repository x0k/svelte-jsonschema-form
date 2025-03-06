import { createFormValidator } from "@sjsf/ajv8-validator";
import { isSchemaObjectValue } from "@sjsf/form/core";
import {
  isFormValueValidator,
  pathToId,
  type FormValueValidator,
  type FormValueValidatorError,
  type ValidationError,
  type Validator,
} from "@sjsf/form";

class StarError {}

function createStarValidator<V extends Validator>(v: V) {
  return {
    ...v,
    validateFormValue(rootSchema, formValue) {
      const errors: ValidationError<FormValueValidatorError<V> | StarError>[] =
        isFormValueValidator(v)
          ? v.validateFormValue(rootSchema, formValue)
          : [];
      return isSchemaObjectValue(formValue) && !formValue["star"]
        ? errors.concat({
            instanceId: pathToId(["star"]),
            propertyTitle: "Star",
            message: "I think so.",
            error: new StarError(),
          })
        : errors;
    },
  } satisfies FormValueValidator<FormValueValidatorError<V> | StarError>;
}

export const validator = createStarValidator(createFormValidator());

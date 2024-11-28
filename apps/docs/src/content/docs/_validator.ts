import Ajv, { type ErrorObject } from "ajv";
import {
  Validator,
  addFormComponents,
  DEFAULT_AJV_CONFIG,
} from "@sjsf/ajv8-validator";
import { isSchemaObjectValue } from "@sjsf/form/core";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  pathToId,
  type Schema,
  type SchemaValue,
  type ValidationError,
} from "@sjsf/form";

class StarValidator extends Validator {
  validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<ErrorObject>[] {
    const errors = super.validateFormData(schema, formData);
    return isSchemaObjectValue(formData) && !formData["star"]
      ? errors.concat({
          instanceId: pathToId(DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR, [
            "star",
          ]),
          propertyTitle: "Star",
          message: "I will try my best!",
          error: {} as ErrorObject,
        })
      : errors;
  }
}

export const validator = new StarValidator(
  addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
);

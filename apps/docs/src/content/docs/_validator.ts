import Ajv, { type ErrorObject } from "ajv";
import {
  AjvValidator,
  addFormComponents,
  DEFAULT_AJV_CONFIG,
} from "@sjsf/ajv8-validator";
import { isSchemaObjectValue } from "@sjsf/form/core";
import type { Schema, SchemaValue, ValidationError } from "@sjsf/form";

class StarValidator extends AjvValidator {
  validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<ErrorObject>[] {
    const errors = super.validateFormData(schema, formData);
    return isSchemaObjectValue(formData) && !formData["star"]
      ? errors.concat({
          instanceId: "root_star",
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

import Ajv, { type ErrorObject } from "ajv";
import {
  AjvValidator,
  addFormComponents,
  DEFAULT_AJV_CONFIG,
} from "@sjsf/ajv8-validator";
import type { Schema, SchemaValue, ValidationError } from "@sjsf/form";

class StarValidator extends AjvValidator {
  validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<ErrorObject>[] {
    return super.validateFormData(schema, formData).map((error) =>
      error.instanceId !== "root_star"
        ? error
        : {
            ...error,
            message: "I will try my best!",
          }
    );
  }
}

export const validator = new StarValidator(
  addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
);

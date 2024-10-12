import type {
  Schema,
  SchemaValue,
  Validator,
} from "@/core/index.js";

import type { Config } from "./config.js";

export interface ValidationError<E> {
  instanceId: string;
  propertyTitle: string;
  message: string;
  error: E;
}

export interface FormValidator<E = unknown> extends Validator {
  validateFormData(
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<E>[];

  validateFieldData(
    field: Config,
    fieldData: SchemaValue | undefined
  ): ValidationError<E>[];
}

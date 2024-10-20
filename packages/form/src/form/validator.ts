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
  /** 
   * Full form validation
   */
  validateFormData(
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<E>[];

  /**
   * Individual field validation
   */
  validateFieldData(
    field: Config,
    fieldData: SchemaValue | undefined
  ): ValidationError<E>[];
}

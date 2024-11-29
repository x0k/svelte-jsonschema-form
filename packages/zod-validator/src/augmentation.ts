import {
  type FormValidator2,
  type UiSchemaRoot,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
} from "@sjsf/form";
import type { ZodIssue, ZodSchema } from "zod";

import { makeFormDataValidationResultTransformer } from "./shared.js";

export interface ZodOptions {
  async?: boolean;
  schema: ZodSchema;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
}

export function withZod<E>(
  validator: FormValidator2<E>,
  {
    schema: zodSchema,
    uiSchema = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    async = false,
  }: ZodOptions
): FormValidator2<E | ZodIssue> {
  const transformFormDataValidationResult =
    makeFormDataValidationResultTransformer(idPrefix, idSeparator, uiSchema);
  return {
    isValid(schema, rootSchema, formData) {
      return validator.isValid(schema, rootSchema, formData);
    },
    validateFieldData(field, fieldData, signal) {
      return validator.validateFieldData(field, fieldData, signal);
    },
    reset() {
      validator.reset();
    },
    validateFormData(_rootSchema, formData) {
      if (async) {
        return zodSchema
          .safeParseAsync(formData)
          .then(transformFormDataValidationResult);
      }
      const result = zodSchema.safeParse(formData);
      return transformFormDataValidationResult(result);
    },
  };
}

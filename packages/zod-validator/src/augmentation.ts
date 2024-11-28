import { getValueByPath } from "@sjsf/form/lib/object";
import {
  type FormValidator,
  type UiSchemaRoot,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  pathToId,
} from "@sjsf/form";
import type { ZodIssue, ZodSchema } from "zod";

export interface ZodOptions {
  schema: ZodSchema;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
}

export function withZod<E>(
  validator: FormValidator<E>,
  {
    schema: zodSchema,
    uiSchema = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
  }: ZodOptions
): FormValidator<E | ZodIssue> {
  return {
    isValid(schema, rootSchema, formData) {
      return validator.isValid(schema, rootSchema, formData);
    },
    validateFieldData(field, fieldData) {
      return validator.validateFieldData(field, fieldData);
    },
    reset() {
      validator.reset();
    },
    validateFormData(_rootSchema, formData) {
      const result = zodSchema.safeParse(formData);
      if (result.success) {
        return [];
      }
      return result.error.issues.map((issue) => {
        const instanceId = pathToId(idPrefix, idSeparator, issue.path);
        const propertyTitle =
          getValueByPath(uiSchema, issue.path)?.["ui:options"]?.title ??
          issue.path[issue.path.length - 1] ??
          instanceId;
        return {
          instanceId,
          propertyTitle,
          message: issue.message,
          error: issue,
        };
      });
    },
  };
}

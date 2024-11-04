import { getValueByPath } from "@sjsf/form/lib/object";
import {
  type FormValidator,
  type UiSchemaRoot,
  type IdConfig,
  DEFAULT_ID_CONFIG,
  pathToId2,
} from "@sjsf/form";
import type { ZodIssue, ZodSchema } from "zod";

export interface ZodOptions {
  schema: ZodSchema;
  uiSchema?: UiSchemaRoot;
  idConfig?: Partial<IdConfig>;
}

export function withZod<E>(
  validator: FormValidator<E>,
  { schema: zodSchema, uiSchema = {}, idConfig = DEFAULT_ID_CONFIG }: ZodOptions
): FormValidator<E | ZodIssue> {
  const normalizedIdConfig = {
    ...DEFAULT_ID_CONFIG,
    ...idConfig,
  };
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
        const instanceId = pathToId2(normalizedIdConfig, issue.path);
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

import {
  getDefaultFormState as getDefaultFormStateInternal,
  type Schema,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";

export function getDefaultFormState(
  validator: Validator,
  schema: Schema,
  formData: SchemaValue | undefined = undefined,
  rootSchema = schema
) {
  return getDefaultFormStateInternal(
    validator,
    schema,
    formData,
    rootSchema,
    false
  );
}

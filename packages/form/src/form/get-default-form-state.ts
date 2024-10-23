import {
  defaultMerger,
  getDefaultFormState2 as getDefaultFormStateInternal,
  type Merger,
  type Schema,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";

/**
 * @deprecated use `getDefaultFormState2`
 */
export function getDefaultFormState(
  validator: Validator,
  schema: Schema,
  formData: SchemaValue | undefined = undefined,
  rootSchema = schema,
  merger: Merger = defaultMerger
) {
  return getDefaultFormState2(validator, merger, schema, formData, rootSchema);
}

export function getDefaultFormState2(
  validator: Validator,
  merger: Merger,
  schema: Schema,
  formData: SchemaValue | undefined = undefined,
  rootSchema = schema
) {
  return getDefaultFormStateInternal(
    validator,
    merger,
    schema,
    formData,
    rootSchema,
    false
  );
}

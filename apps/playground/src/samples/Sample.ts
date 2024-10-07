import type { Schema, SchemaValue, ValidatorError, UiSchemaRoot } from '@sjsf/form/core';
import type { AjvValidator } from '@sjsf/form/validators';

type SampleStatus = "perfect" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
  errors?: ValidatorError<unknown>[];
  Validator?: typeof AjvValidator
  validate?: (value: SchemaValue | undefined) => ValidatorError<unknown>[];
}

import type { Schema, SchemaValue, ValidatorError, UiSchemaRoot } from '@sjsf/form';
import type { AjvValidator } from '@sjsf/ajv8-validator';

type SampleStatus = "perfect" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
  errors?: ValidatorError<unknown>[];
  Validator?: typeof AjvValidator
}

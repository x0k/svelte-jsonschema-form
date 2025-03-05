import type {
  FieldErrorsMap,
  FieldValueValidator,
  FormValueValidator,
  Schema,
  SchemaValue,
  UiSchemaRoot,
} from "@sjsf/form";
import type { Validator } from "@sjsf/form/core";

type SampleStatus = "perfect" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
  errors?: FieldErrorsMap<any>;
  customizeValidator?: (
    v: Validator & FormValueValidator<any> & FieldValueValidator<any>
  ) => Validator & FormValueValidator<any> & FieldValueValidator<any>;
}

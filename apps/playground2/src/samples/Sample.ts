import type {
  Schema,
  SchemaValue,
  UiSchemaRoot,
  FormErrors,
  FormValidator,
} from "@sjsf/form";

type SampleStatus = "perfect" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
  errors?: FormErrors<any>;
  customizeValidator?: (v: FormValidator<any>) => FormValidator<any>;
}

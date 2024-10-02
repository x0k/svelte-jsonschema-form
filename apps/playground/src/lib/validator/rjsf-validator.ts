import validator from "@rjsf/validator-ajv8";

import type {
  Schema,
  SchemaDefinition,
  SchemaValue,
  Validator,
} from "@/components/form";

export class RJSFValidator implements Validator {
  isValid(
    schemaDefinition: SchemaDefinition,
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean {
    return validator.isValid(schemaDefinition as Schema, formData, rootSchema);
  }
}

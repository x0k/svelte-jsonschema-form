import type Ajv from "ajv";
import type { ValidateFunction } from "ajv";

import type { Schema, SchemaDefinition, Validator } from "@/components/form";

const trueSchema: Schema = {};
const falseSchema: Schema = {};

export class AjvValidator<T> implements Validator<T> {
  private cache = new WeakMap<Schema, ValidateFunction<T>>();

  constructor(private readonly ajv: Ajv) {}

  isValid(
    schemaDefinition: SchemaDefinition,
    _rootSchema: Schema,
    formData?: T | undefined
  ): boolean {
    try {
      const validator = this.getValidator(schemaDefinition)
      return validator(formData)
    } catch (e) {
      console.warn("Failed to validate", e)
      return false
    }
  }

  private getValidator(schemaDefinition: SchemaDefinition) {
    const schema = this.transformSchemaDefinition(schemaDefinition);
    let validator = this.cache.get(schema)
    if (validator) {
      return validator
    }
    validator = this.ajv.compile(schema)
    this.cache.set(schema, validator)
    return validator
  }

  private transformSchemaDefinition(schema: SchemaDefinition): Schema {
    switch (schema) {
      case true:
        return trueSchema;
      case false:
        return falseSchema;
      default:
        return schema;
    }
  }
}

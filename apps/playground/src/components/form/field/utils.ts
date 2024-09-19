import {
  isSchemaOfConstantValue,
  retrieveSchema,
  type Schema,
  type Validator,
} from "../schema";

export class FieldUtils<T> {
  constructor(
    protected readonly validator: Validator<T>,
    protected readonly rootSchema: Schema
  ) {}

  isSelect(theSchema: Schema) {
    const schema = retrieveSchema(this.validator, theSchema, this.rootSchema);
    if (Array.isArray(schema.enum)) {
      return true;
    }
    const altSchemas = schema.oneOf || schema.anyOf;
    if (Array.isArray(altSchemas)) {
      return altSchemas.every(
        (altSchemas) =>
          typeof altSchemas !== "boolean" && isSchemaOfConstantValue(altSchemas)
      );
    }
    return false;
  }
}

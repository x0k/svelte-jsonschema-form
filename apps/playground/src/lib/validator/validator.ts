import type Ajv from "ajv";
import type { ErrorObject } from "ajv";
import { deepEqual } from "fast-equals";

import { getValueByPath } from "@/lib/object";
import {
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  schemaHash,
  ValidatorErrorType,
  type DataValidator,
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
  type UiSchema,
  type UiSchemaRoot,
  type Validator,
  type ValidatorError,
} from "@/components/form";

const trueSchema: Schema = {};
const falseSchema: Schema = {};

export class AjvValidator implements Validator, DataValidator<ErrorObject> {
  constructor(private readonly ajv: Ajv) {}

  reset() {
    this.ajv.removeSchema();
  }

  validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined,
    uiSchema: UiSchemaRoot
  ): ValidatorError<ErrorObject>[] {
    const schemaRef = schema[ID_KEY];
    let errors: ErrorObject[] | null | undefined;
    try {
      const validator =
        (schemaRef && this.ajv.getSchema(schemaRef)) ||
        this.ajv.compile(schema);
      validator(formData);
      errors = validator.errors;
      validator.errors = null;
    } catch (err) {
      return [
        {
          type: ValidatorErrorType.SchemaError,
          error: err as Error,
          message:
            err instanceof Error
              ? err.message
              : "Unknown error during schema compilation",
        },
      ];
    }
    return (
      errors?.map((error) => {
        return {
          type: ValidatorErrorType.ValidationError,
          instancePath: error.instancePath,
          message: this.errorObjectToMessage(error, uiSchema),
          error,
        };
      }) ?? []
    );
  }

  isValid(
    schemaDefinition: SchemaDefinition,
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean {
    const rootSchemaId = this.handleRootSchemaUpdate(rootSchema);
    const schemaWithPrefixedRefs = prefixSchemaRefs(
      this.transformSchemaDefinition(schemaDefinition),
      rootSchemaId
    );
    const schemaId =
      schemaWithPrefixedRefs[ID_KEY] ?? schemaHash(schemaWithPrefixedRefs);
    const validator =
      this.ajv.getSchema(schemaId) ??
      this.ajv
        .addSchema(schemaWithPrefixedRefs, schemaId)
        .getSchema(schemaId) ??
      this.ajv.compile(schemaWithPrefixedRefs);
    try {
      return validator(formData);
    } catch (e) {
      console.warn("Failed to validate", e);
      return false;
    }
  }

  private errorObjectToMessage(
    {
      instancePath,
      message = "",
      params: { missingProperty },
      parentSchema,
    }: ErrorObject,
    uiSchema: UiSchemaRoot
  ): string {
    const path = instancePath.split("/").slice(1);
    if (missingProperty) {
      path.push(missingProperty);
      // TODO: Write a specific `getValueByPath` function for
      // `items`, `additionalItems` and other cases
      const propertyUiSchema: UiSchema | undefined = getValueByPath(
        uiSchema,
        path
      );
      const title: string | undefined =
        propertyUiSchema?.["ui:options"]?.title ??
        parentSchema?.properties?.[missingProperty]?.title;
      return title ? message.replace(missingProperty, title) : message;
    }
    const instanceUiSchema: UiSchema | undefined = getValueByPath(
      uiSchema,
      path
    );
    const title: string | undefined =
      instanceUiSchema?.["ui:options"]?.title ?? parentSchema?.title;
    return `'${title || instancePath}' ${message}`.trimEnd();
  }

  private handleRootSchemaUpdate(rootSchema: Schema) {
    const rootSchemaId = rootSchema[ID_KEY] ?? ROOT_SCHEMA_PREFIX;
    let schema = this.ajv.getSchema(rootSchemaId)?.schema;
    if (schema !== undefined && !deepEqual(schema, rootSchema)) {
      this.ajv.removeSchema(rootSchemaId);
      schema = undefined;
    }
    if (schema === undefined) {
      this.ajv.addSchema(rootSchema, rootSchemaId);
    }
    return rootSchemaId;
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

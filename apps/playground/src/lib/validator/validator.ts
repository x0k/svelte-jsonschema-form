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
  type FormContext,
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
    ctx: FormContext,
    schema: Schema,
    formData: SchemaValue | undefined
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
        let path = error.instancePath.split("/");
        if (path[0] === "") {
          path = path.slice(1);
        }
        return {
          type: ValidatorErrorType.ValidationError,
          instanceId: this.instancePathToId(ctx, path),
          propertyTitle: this.errorObjectToPropertyTitle(error, path, ctx.uiSchema),
          message: this.errorObjectToMessage(error, path, ctx.uiSchema),
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

  private instancePathToId(
    { idPrefix, idSeparator }: FormContext,
    path: string[]
  ) {
    return `${idPrefix}${idSeparator}${path.join(idSeparator)}`;
  }

  private errorObjectToMessage(
    { params: { missingProperty }, parentSchema, message }: ErrorObject,
    path: string[],
    uiSchema: UiSchemaRoot
  ): string {
    if (!message) {
      return "";
    }
    if (missingProperty) {
      // TODO: Write a specific `getValueByPath` function for
      // `items`, `additionalItems` and other cases
      const propertyUiSchema: UiSchema | undefined = getValueByPath(
        uiSchema,
        path.concat(missingProperty)
      );
      const customPropertyTitle: string | undefined =
        propertyUiSchema?.["ui:options"]?.title ??
        parentSchema?.properties?.[missingProperty]?.title;
      if (customPropertyTitle) {
        return message.replace(missingProperty, customPropertyTitle);
      }
    }
    return message;
  }

  private errorObjectToPropertyTitle(
    { parentSchema }: ErrorObject,
    path: string[],
    uiSchema: UiSchemaRoot
  ): string {
    const instanceUiSchema: UiSchema | undefined = getValueByPath(
      uiSchema,
      path
    );
    return (
      instanceUiSchema?.["ui:options"]?.title ??
      parentSchema?.title ??
      path.join(".")
    );
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

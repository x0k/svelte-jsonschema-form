import type { Ajv } from "ajv";
import type { ErrorObject } from "ajv";

import { deepEqual } from "@sjsf/form/lib/deep-equal";
import { getValueByPath } from "@sjsf/form/lib/object";
import {
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  schemaHash,
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
} from "@sjsf/form/core";
import type {
  Config,
  FieldErrors,
  FormValidator,
  UiSchema,
  UiSchemaRoot,
  ValidationError,
} from "@sjsf/form";

const trueSchema: Schema = {};
const falseSchema: Schema = {};

const FIELD_KEY = "field";
const NO_ERRORS: FieldErrors<ErrorObject> = [];

export class AjvValidator implements FormValidator<ErrorObject> {
  private fieldValidationSchemaRequired: string[] = [];
  private fieldValidationSchema = {
    type: "object",
    properties: {
      field: {},
    },
    required: this.fieldValidationSchemaRequired,
  } satisfies Schema;
  private fieldValidationData: { field: SchemaValue | undefined } = {
    field: undefined,
  };

  constructor(
    private readonly ajv: Ajv,
    private readonly uiSchema: UiSchemaRoot = {},
    private readonly idPrefix: string = "root",
    private readonly idSeparator: string = "_"
  ) {}

  reset() {
    this.ajv.removeSchema();
  }

  validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<ErrorObject>[] {
    const schemaRef = schema[ID_KEY];
    const validator =
      (schemaRef && this.ajv.getSchema(schemaRef)) || this.ajv.compile(schema);
    validator(formData);
    let errors: ErrorObject[] | null | undefined;
    errors = validator.errors;
    validator.errors = null;
    return (
      errors?.map((error) => {
        let path = error.instancePath.split("/");
        if (path[0] === "") {
          path = path.slice(1);
        }
        return {
          instanceId: this.instancePathToId(error, path),
          propertyTitle: this.errorObjectToPropertyTitle(error, path),
          message: this.errorObjectToMessage(
            error,
            (missingProperty, parentSchema) => {
              // TODO: Write a specific `getValueByPath` function for
              // `items`, `additionalItems` and other cases
              const uiSchemaTitle = getValueByPath(
                this.uiSchema,
                path.concat(missingProperty)
              )?.["ui:options"]?.title;
              if (uiSchemaTitle !== undefined) {
                return uiSchemaTitle;
              }
              const prop = parentSchema?.properties?.[missingProperty];
              if (typeof prop === "object") {
                return prop.title;
              }
              return undefined;
            }
          ),
          error,
        };
      }) ?? NO_ERRORS
    );
  }

  validateFieldData(
    config: Config,
    fieldData: SchemaValue | undefined
  ): FieldErrors<ErrorObject> {
    const instanceId = config.idSchema.$id;
    if (instanceId === this.idPrefix) {
      return this.validateFormData(config.schema, fieldData);
    }
    const schema = this.getFieldValidationSchemaForSyncValidation(config);
    const validator = this.ajv.compile(schema);
    const data = this.getFieldValidationDataForSyncValidation(fieldData);
    validator(data);
    let errors: ErrorObject[] | null | undefined;
    errors = validator.errors;
    validator.errors = null;
    console.log(schema, errors);
    return (
      errors?.map((error) => ({
        instanceId,
        propertyTitle: config.title,
        message: this.errorObjectToMessage(error, () => config.title),
        error,
      })) ?? NO_ERRORS
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

  private getFieldValidationSchemaForSyncValidation(config: Config) {
    this.fieldValidationSchema.properties.field = config.schema;
    if (config.required) {
      this.fieldValidationSchemaRequired.length = 1;
      this.fieldValidationSchemaRequired[0] = FIELD_KEY;
    } else {
      this.fieldValidationSchemaRequired.length = 0;
    }
    return this.fieldValidationSchema;
  }

  private getFieldValidationDataForSyncValidation(
    data: SchemaValue | undefined
  ) {
    this.fieldValidationData.field = data;
    return this.fieldValidationData;
  }

  private instancePathToId(
    { params: { missingProperty } }: ErrorObject,
    path: string[]
  ) {
    const id =
      path.length === 0
        ? this.idPrefix
        : `${this.idPrefix}${this.idSeparator}${path.join(this.idSeparator)}`;
    return missingProperty !== undefined
      ? `${id}${this.idSeparator}${missingProperty}`
      : id;
  }

  private errorObjectToMessage(
    { params: { missingProperty }, parentSchema, message }: ErrorObject,
    getPropertyTitle: (
      missingProperty: string,
      parentSchema?: Schema
    ) => string | undefined
  ): string {
    if (!message) {
      return "";
    }
    if (missingProperty === undefined) {
      return message;
    }
    const propertyTitle = getPropertyTitle(missingProperty, parentSchema);
    if (propertyTitle === undefined) {
      return message;
    }
    return message.replace(missingProperty, propertyTitle);
  }

  private errorObjectToPropertyTitle(
    { parentSchema }: ErrorObject,
    path: string[]
  ): string {
    const instanceUiSchema: UiSchema | undefined = getValueByPath(
      this.uiSchema,
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

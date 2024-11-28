import type { Ajv, ValidateFunction } from "ajv";
import type { ErrorObject } from "ajv";

import { deepEqual } from "@sjsf/form/lib/deep-equal";
import { getValueByPath } from "@sjsf/form/lib/object";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import {
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
} from "@sjsf/form/core";
import {
  computePseudoId,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  pathToId,
  type Config,
  type FieldErrors,
  type FormValidator,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";

const trueSchema: Schema = {};
const falseSchema: Schema = {};

const FIELD_REQUIRED = ["field"];
const FIELD_NOT_REQUIRED: string[] = [];
const NO_ERRORS: FieldErrors<ErrorObject> = [];

export function makeSchemaCompiler(ajv: Ajv) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  const validatorsCache = new WeakMap<Schema, ValidateFunction>();
  const compile = weakMemoize<Schema, ValidateFunction>(
    validatorsCache,
    (schema) => {
      return ajv.compile(
        usePrefixSchemaRefs ? prefixSchemaRefs(schema, rootSchemaId) : schema
      );
    }
  );
  return (schema: Schema, rootSchema: Schema) => {
    rootSchemaId = rootSchema[ID_KEY] ?? ROOT_SCHEMA_PREFIX;
    let ajvSchema = ajv.getSchema(rootSchemaId)?.schema;
    // @deprecated
    // TODO: Replace deep equality comparison with reference equality by default
    if (ajvSchema !== undefined && !deepEqual(ajvSchema, rootSchema)) {
      ajv.removeSchema(rootSchemaId);
      validatorsCache.delete(schema);
      ajvSchema = undefined;
    }
    if (ajvSchema === undefined) {
      ajv.addSchema(rootSchema, rootSchemaId);
    }
    usePrefixSchemaRefs = schema !== rootSchema;
    return compile(schema);
  };
}

export function makeFieldSchemaCompiler(ajv: Ajv) {
  let isRequired = false;
  const validatorsCache = new WeakMap<Schema, ValidateFunction>();
  const requiredCache = new WeakMap<Schema, boolean>();
  const compile = weakMemoize<Schema, ValidateFunction>(
    validatorsCache,
    (schema) =>
      ajv.compile({
        type: "object",
        properties: {
          field: schema,
        },
        required: isRequired ? FIELD_REQUIRED : FIELD_NOT_REQUIRED,
      })
  );
  return (config: Config) => {
    isRequired = config.required;
    const prev = requiredCache.get(config.schema);
    if (prev !== config.required) {
      validatorsCache.delete(config.schema);
      requiredCache.set(config.schema, config.required);
    }
    return compile(config.schema);
  };
}

export interface ValidatorOptions {
  ajv: Ajv;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
  idPseudoSeparator?: string;
  compileSchema?: (schema: Schema, rootSchema: Schema) => ValidateFunction;
  compileFieldSchema?: (config: Config) => ValidateFunction;
}

export class Validator implements FormValidator<ErrorObject> {
  private readonly ajv: Ajv;
  private readonly uiSchema: UiSchemaRoot;
  private readonly idPrefix: string;
  private readonly idSeparator: string;
  private readonly idPseudoSeparator: string;
  private readonly compileSchema: (
    schema: Schema,
    rootSchema: Schema
  ) => ValidateFunction;
  private readonly compileFieldSchema: (config: Config) => ValidateFunction;
  constructor({
    ajv,
    uiSchema = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR,
    compileSchema = makeSchemaCompiler(ajv),
    compileFieldSchema = makeFieldSchemaCompiler(ajv),
  }: ValidatorOptions) {
    this.ajv = ajv;
    this.uiSchema = uiSchema;
    this.idPrefix = idPrefix;
    this.idSeparator = idSeparator;
    this.idPseudoSeparator = idPseudoSeparator;
    this.compileSchema = compileSchema;
    this.compileFieldSchema = compileFieldSchema;
  }

  isValid(
    schemaDefinition: SchemaDefinition,
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean {
    const validator = this.compileSchema(
      this.transformSchemaDefinition(schemaDefinition),
      rootSchema
    );
    try {
      return validator(formData);
    } catch (e) {
      console.warn("Failed to validate", e);
      return false;
    }
  }

  validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<ErrorObject>[] {
    const validator = this.compileSchema(schema, schema);
    validator(formData);
    const errors = validator.errors;
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
    const validator = this.compileFieldSchema(config);
    const data = { field: fieldData };
    validator(data);
    const errors = validator.errors;
    validator.errors = null;
    return (
      errors?.map((error) => ({
        instanceId,
        propertyTitle: config.title,
        message: this.errorObjectToMessage(error, () => config.title),
        error,
      })) ?? NO_ERRORS
    );
  }

  reset() {
    this.ajv.removeSchema();
  }

  private instancePathToId(
    {
      params: { missingProperty, propertyName: propertyNameParam },
      propertyName = propertyNameParam,
    }: ErrorObject,
    path: string[]
  ) {
    let id = pathToId(this.idPrefix, this.idSeparator, path);
    id =
      missingProperty !== undefined
        ? `${id}${this.idSeparator}${missingProperty}`
        : id;
    id =
      propertyName !== undefined
        ? computePseudoId(
            this.idPseudoSeparator,
            `${id}${this.idSeparator}${propertyName}`,
            "key-input"
          )
        : id;
    return id;
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

/** @deprecated Use `Validator` */
export class AjvValidator extends Validator {
  constructor(
    ajv: Ajv,
    uiSchema: UiSchemaRoot = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR
  ) {
    super({
      ajv,
      uiSchema,
      idPrefix,
      idSeparator,
      idPseudoSeparator,
    });
  }
}

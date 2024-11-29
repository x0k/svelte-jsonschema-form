import { Ajv, type AsyncValidateFunction, type ValidateFunction } from "ajv";
import type { ErrorObject, AnySchema } from "ajv";

import type { MaybePromise } from '@sjsf/form/lib/types';
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
  type FormValidator2,
  type UiSchema,
  type UiSchemaRoot,
} from "@sjsf/form";
import type { AnyValidateFunction } from "ajv/dist/core.js";

const trueSchema: Schema = {};
const falseSchema: Schema = {
  not: {},
};

const FIELD_REQUIRED = ["field"];
const FIELD_NOT_REQUIRED: string[] = [];
const NO_ERRORS: FieldErrors<ErrorObject> = [];

export function makeSchemaCompiler<A extends boolean>(ajv: Ajv, _async: A) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  const validatorsCache = new WeakMap<Schema, AnyValidateFunction>();
  const compile = weakMemoize<Schema, AnyValidateFunction>(
    validatorsCache,
    (schema) => {
      let ajvSchema: AnySchema = schema;
      if (usePrefixSchemaRefs) {
        ajvSchema = prefixSchemaRefs(schema, rootSchemaId);
        delete ajvSchema[ID_KEY];
      }
      return ajv.compile(ajvSchema);
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
    return compile(schema) as A extends true
      ? AsyncValidateFunction
      : ValidateFunction;
  };
}

export function makeFieldSchemaCompiler<A extends boolean>(
  ajv: Ajv,
  _async: A
) {
  let isRequired = false;
  const validatorsCache = new WeakMap<Schema, AnyValidateFunction>();
  const requiredCache = new WeakMap<Schema, boolean>();
  const compile = weakMemoize<Schema, AnyValidateFunction>(
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
    return compile(config.schema) as A extends true
      ? AsyncValidateFunction
      : ValidateFunction;
  };
}

export interface AbstractValidatorOptions {
  ajv: Ajv;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
  idPseudoSeparator?: string;
}

export abstract class AbstractValidator implements FormValidator2<ErrorObject> {
  protected readonly ajv: Ajv;
  protected readonly uiSchema: UiSchemaRoot;
  protected readonly idPrefix: string;
  protected readonly idSeparator: string;
  protected readonly idPseudoSeparator: string;

  protected abstract compileSchema(
    schema: Schema,
    rootSchema: Schema
  ): ValidateFunction;

  constructor({
    ajv,
    uiSchema = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR,
  }: ValidatorOptions) {
    this.ajv = ajv;
    this.uiSchema = uiSchema;
    this.idPrefix = idPrefix;
    this.idSeparator = idSeparator;
    this.idPseudoSeparator = idPseudoSeparator;
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

  abstract validateFormData(
    rootSchema: Schema,
    formData: SchemaValue | undefined,
    signal: AbortSignal
  ): MaybePromise<FieldErrors<ErrorObject>>;

  abstract validateFieldData(
    config: Config,
    fieldData: SchemaValue | undefined,
    signal: AbortSignal
  ): MaybePromise<FieldErrors<ErrorObject>>;

  reset() {
    this.ajv.removeSchema();
  }

  protected transformFieldErrors(errors: ErrorObject[], config: Config) {
    return errors.map((error) => ({
      instanceId: config.idSchema.$id,
      propertyTitle: config.title,
      message: this.errorObjectToMessage(error, () => config.title),
      error,
    }));
  }

  protected transformErrors(errors: ErrorObject[]) {
    return errors.map((error) => {
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
    });
  }

  protected instancePathToId(
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

  protected errorObjectToMessage(
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

  protected errorObjectToPropertyTitle(
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

  protected transformSchemaDefinition(schema: SchemaDefinition): Schema {
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

export interface ValidatorOptions extends AbstractValidatorOptions {
  compileSchema?: (schema: Schema, rootSchema: Schema) => ValidateFunction;
  compileFieldSchema?: (config: Config) => ValidateFunction;
}

export class Validator extends AbstractValidator {
  protected readonly compileSchema: (
    schema: Schema,
    rootSchema: Schema
  ) => ValidateFunction;
  protected readonly compileFieldSchema: (config: Config) => ValidateFunction;

  constructor({
    compileSchema,
    compileFieldSchema,
    ...rest
  }: ValidatorOptions) {
    super(rest);
    this.compileSchema = compileSchema ?? makeSchemaCompiler(rest.ajv, false);
    this.compileFieldSchema =
      compileFieldSchema ?? makeFieldSchemaCompiler(rest.ajv, false);
  }

  override validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): FieldErrors<ErrorObject> {
    const validator = this.compileSchema(schema, schema);
    validator(formData);
    const errors = validator.errors;
    validator.errors = null;
    if (!errors) {
      return NO_ERRORS;
    }
    return this.transformErrors(errors);
  }

  override validateFieldData(
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
    if (!errors) {
      return NO_ERRORS;
    }
    return this.transformFieldErrors(errors, config);
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

export interface AsyncValidatorOptions extends AbstractValidatorOptions {
  compileSchema?: (schema: Schema, rootSchema: Schema) => ValidateFunction;
  compileAsyncSchema?: (
    schema: Schema,
    rootSchema: Schema
  ) => AsyncValidateFunction;
  compileAsyncFieldSchema?: (config: Config) => AsyncValidateFunction;
}

export class AsyncValidator extends AbstractValidator {
  protected readonly compileSchema: (
    schema: Schema,
    rootSchema: Schema
  ) => ValidateFunction;
  protected readonly compileAsyncSchema: (
    schema: Schema,
    rootSchema: Schema
  ) => AsyncValidateFunction;
  protected readonly compileAsyncFieldSchema: (
    config: Config
  ) => AsyncValidateFunction;
  constructor({
    compileSchema,
    compileAsyncSchema,
    compileAsyncFieldSchema,
    ...rest
  }: AsyncValidatorOptions) {
    super(rest);
    this.compileSchema = compileSchema ?? makeSchemaCompiler(rest.ajv, false);
    this.compileAsyncSchema =
      compileAsyncSchema ?? makeSchemaCompiler(rest.ajv, true);
    this.compileAsyncFieldSchema =
      compileAsyncFieldSchema ?? makeFieldSchemaCompiler(rest.ajv, true);
  }

  override async validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): Promise<FieldErrors<ErrorObject>> {
    const validator = this.compileAsyncSchema(schema, schema);
    try {
      await validator(formData);
    } catch (error) {
      if (!(error instanceof Ajv.ValidationError)) {
        throw error;
      }
      return this.transformErrors(error.errors as ErrorObject[]);
    } finally {
      validator.errors = null;
    }
    return NO_ERRORS;
  }

  override async validateFieldData(
    config: Config,
    fieldData: SchemaValue | undefined
  ): Promise<FieldErrors<ErrorObject>> {
    const instanceId = config.idSchema.$id;
    if (instanceId === this.idPrefix) {
      return this.validateFormData(config.schema, fieldData);
    }
    const validator = this.compileAsyncFieldSchema(config);
    const data = { field: fieldData };
    try {
      await validator(data);
    } catch (error) {
      if (!(error instanceof Ajv.ValidationError)) {
        throw error;
      }
      return this.transformFieldErrors(error.errors as ErrorObject[], config);
    } finally {
      validator.errors = null;
    }
    return NO_ERRORS;
  }
}

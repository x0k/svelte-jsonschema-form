import type {
  Validator as CfValidator,
  OutputUnit,
  Schema as CfSchema,
} from "@cfworker/json-schema";

import { weakMemoize } from "@sjsf/form/lib/memoize";
import {
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type SchemaDefinition,
} from "@sjsf/form/core";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  pathToId,
  type Config,
  type FormValidator2,
  type Schema,
  type SchemaValue,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import { getValueByPath } from "@sjsf/form/lib/object";

const trueSchema: Schema = {};
const falseSchema: Schema = {
  not: {},
};

const FIELD_NOT_REQUIRED: string[] = [];

export type CfValidatorFactory = (schema: Schema) => CfValidator;

export function makeValidatorFactory(factory: CfValidatorFactory) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  let lastRootSchema: WeakRef<Schema> = new WeakRef({});
  const validatorsCache = new WeakMap<Schema, CfValidator>();
  const makeValidator = weakMemoize<Schema, CfValidator>(
    validatorsCache,
    (schema) =>
      factory(
        usePrefixSchemaRefs ? prefixSchemaRefs(schema, rootSchemaId) : schema
      )
  );
  return (schema: Schema, rootSchema: Schema) => {
    rootSchemaId = rootSchema[ID_KEY] ?? ROOT_SCHEMA_PREFIX;
    usePrefixSchemaRefs = schema !== rootSchema;
    const validator = makeValidator(schema);
    if (usePrefixSchemaRefs && lastRootSchema?.deref() !== rootSchema) {
      lastRootSchema = new WeakRef(rootSchema);
      validator.addSchema(
        $state.snapshot(rootSchema) as CfSchema,
        rootSchemaId
      );
    }
    return validator;
  };
}

export function makeFieldValidatorFactory(factory: CfValidatorFactory) {
  let fieldTitle = "";
  let isRequired = false;
  const validatorsCache = new WeakMap<Schema, CfValidator>();
  const requiredCache = new WeakMap<Schema, boolean>();
  const makeValidator = weakMemoize<Schema, CfValidator>(
    validatorsCache,
    (schema) =>
      factory({
        type: "object",
        properties: {
          [fieldTitle]: schema,
        },
        required: isRequired ? [fieldTitle] : FIELD_NOT_REQUIRED,
      })
  );
  return (config: Config) => {
    fieldTitle = config.title;
    isRequired = config.required;
    const prev = requiredCache.get(config.schema);
    if (prev !== isRequired) {
      validatorsCache.delete(config.schema);
      requiredCache.set(config.schema, isRequired);
    }
    return makeValidator(config.schema);
  };
}

export interface ValidatorOptions {
  factory: CfValidatorFactory;
  uiSchema?: UiSchemaRoot;
  idPrefix?: string;
  idSeparator?: string;
  createValidator?: (schema: Schema, rootSchema: Schema) => CfValidator;
  createFieldValidator?: (config: Config) => CfValidator;
}

export class Validator implements FormValidator2<OutputUnit> {
  private readonly uiSchema: UiSchemaRoot;
  private readonly idPrefix: string;
  private readonly idSeparator: string;
  private readonly createValidator: (
    schema: Schema,
    rootSchema: Schema
  ) => CfValidator;
  private readonly createFieldValidator: (config: Config) => CfValidator;
  constructor({
    factory,
    uiSchema = {},
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    createValidator = makeValidatorFactory(factory),
    createFieldValidator = makeFieldValidatorFactory(factory),
  }: ValidatorOptions) {
    this.uiSchema = uiSchema;
    this.idPrefix = idPrefix;
    this.idSeparator = idSeparator;
    this.createValidator = createValidator;
    this.createFieldValidator = createFieldValidator;
  }

  isValid(
    schema: SchemaDefinition,
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean {
    const validator = this.createValidator(
      this.transformSchemaDefinition(schema),
      rootSchema
    );
    return validator.validate(formData).valid;
  }

  validateFormData(
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<OutputUnit>[] {
    const validator = this.createValidator(rootSchema, rootSchema);
    const errors = validator.validate(formData).errors;
    return errors.map((unit) => {
      let path = unit.instanceLocation.split("/");
      if (path[0] === "#") {
        path = path.slice(1);
      }
      return {
        instanceId: pathToId(this.idPrefix, this.idSeparator, path),
        propertyTitle: this.unitToPropertyTitle(unit, path, rootSchema),
        message: unit.error,
        error: unit,
      };
    });
  }

  validateFieldData(
    field: Config,
    fieldData: SchemaValue | undefined
  ): ValidationError<OutputUnit>[] {
    const instanceId = field.idSchema.$id;
    if (instanceId === this.idPrefix) {
      return this.validateFormData(field.schema, fieldData);
    }
    const validator = this.createFieldValidator(field);
    const errors = validator.validate(
      fieldData === undefined ? {} : { [field.title]: fieldData }
    ).errors;
    return errors.map((unit) => {
      return {
        instanceId,
        propertyTitle: field.title,
        message: unit.error,
        error: unit,
      };
    });
  }

  reset(): void {}

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

  private unitToPropertyTitle(
    unit: OutputUnit,
    path: string[],
    rootSchema: Schema
  ): string {
    const instanceUiSchema: UiSchema | undefined = getValueByPath(
      this.uiSchema,
      path
    );
    const uiTitle = instanceUiSchema?.["ui:options"]?.title;
    if (uiTitle) {
      return uiTitle;
    }
    let schemaPath = unit.keywordLocation.split("/");
    schemaPath = schemaPath.slice(1, -1);
    const schema = getValueByPath(rootSchema, schemaPath) as Schema | undefined;
    const schemaTitle = schema?.title;
    if (schemaTitle) {
      return schemaTitle;
    }
    return path.join(".");
  }
}

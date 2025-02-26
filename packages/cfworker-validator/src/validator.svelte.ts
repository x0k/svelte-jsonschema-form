import {
  Validator as CfValidator,
  type OutputUnit,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  pathToId,
  type Config,
  type Schema,
  type SyncFieldValueValidator,
  type SyncFormValueValidator,
  type UiSchema,
  type UiSchemaRoot,
} from "@sjsf/form";
import {
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type SchemaDefinition,
  type Validator,
} from "@sjsf/form/core";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import { getValueByPath } from "@sjsf/form/lib/object";

export interface ValidatorOptions {
  createSchemaValidator: (schema: Schema, rootSchema: Schema) => CfValidator;
}

const TRUE_SCHEMA: Schema = {};
const FALSE_SCHEMA: Schema = {
  not: {},
};

const FIELD_NOT_REQUIRED: string[] = [];

export type CfValidatorFactory = (schema: Schema) => CfValidator;

export function createSchemaValidatorFactory(factory: CfValidatorFactory) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  let lastRootSchema: WeakRef<Schema> = new WeakRef({});
  const validatorsCache = new WeakMap<Schema, CfValidator>();
  const makeValidator = weakMemoize<Schema, CfValidator>(
    validatorsCache,
    (schema) => {
      const snapshot = $state.snapshot(schema);
      return factory(
        usePrefixSchemaRefs
          ? prefixSchemaRefs(snapshot, rootSchemaId)
          : snapshot
      );
    }
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

export function createFieldSchemaValidatorFactory(factory: CfValidatorFactory) {
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

function transformSchemaDefinition(schema: SchemaDefinition): Schema {
  switch (schema) {
    case true:
      return TRUE_SCHEMA;
    case false:
      return FALSE_SCHEMA;
    default:
      return schema;
  }
}

export function createValidator({
  createSchemaValidator,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, rootSchema, formValue) {
      const validator = createSchemaValidator(
        transformSchemaDefinition(schema),
        rootSchema
      );
      return validator.validate(formValue).valid;
    },
  };
}

interface ErrorsTransformerOptions {
  idPrefix: string;
  idSeparator: string;
  uiSchema: UiSchemaRoot;
}

function createErrorsTransformer({
  idPrefix,
  idSeparator,
  uiSchema,
}: ErrorsTransformerOptions) {
  const unitToPropertyTitle = (
    unit: OutputUnit,
    path: string[],
    rootSchema: Schema
  ): string => {
    const instanceUiSchema = getValueByPath<UiSchema, 0>(uiSchema, path);
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
  };
  return (rootSchema: Schema, errors: OutputUnit[]) =>
    errors.map((unit) => {
      let path = unit.instanceLocation.split("/");
      if (path[0] === "#") {
        path = path.slice(1);
      }
      return {
        instanceId: pathToId(idPrefix, idSeparator, path),
        propertyTitle: unitToPropertyTitle(unit, path, rootSchema),
        message: unit.error,
        error: unit,
      };
    });
}

export interface SyncFormValueValidatorOptions
  extends ValidatorOptions,
    ErrorsTransformerOptions {}

export function createSyncFormValueValidator(
  options: SyncFormValueValidatorOptions
): SyncFormValueValidator<OutputUnit> {
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      const errorsTransformer = createErrorsTransformer(options);
      return errorsTransformer(
        rootSchema,
        validator.validate(formValue).errors
      );
    },
  };
}

export interface SyncFieldValueValidatorOptions {
  createFieldSchemaValidator: (config: Config) => CfValidator;
}

export function createSyncFieldValueValidator({
  createFieldSchemaValidator,
}: SyncFieldValueValidatorOptions): SyncFieldValueValidator<OutputUnit> {
  return {
    validateFieldValue(config, fieldValue) {
      const validator = createFieldSchemaValidator(config);
      const errors = validator.validate(
        fieldValue === undefined ? {} : { [config.title]: fieldValue }
      ).errors;
      return errors
        .filter((error) => error.instanceLocation === `#/${config.title}`)
        .map((unit) => {
          return {
            instanceId: config.id,
            propertyTitle: config.title,
            message: unit.error,
            error: unit,
          };
        });
    },
  };
}

export interface SyncFormValidatorOptions
  extends ValidatorOptions,
    SyncFormValueValidatorOptions,
    SyncFieldValueValidatorOptions {}

export function createSyncFormValidator({
  factory = (schema) => new CfValidator(schema as CfSchema, "7", false),
  createSchemaValidator = createSchemaValidatorFactory(factory),
  createFieldSchemaValidator = createFieldSchemaValidatorFactory(factory),
  idPrefix = DEFAULT_ID_PREFIX,
  idSeparator = DEFAULT_ID_SEPARATOR,
  uiSchema = {},
}: Partial<SyncFormValidatorOptions> & {
  factory?: CfValidatorFactory;
} = {}) {
  const options: SyncFormValidatorOptions = {
    createSchemaValidator,
    createFieldSchemaValidator,
    idPrefix,
    uiSchema,
    idSeparator,
  };
  return Object.assign(
    createValidator(options),
    createSyncFormValueValidator(options),
    createSyncFieldValueValidator(options)
  );
}

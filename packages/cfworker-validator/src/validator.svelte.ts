import {
  Validator as CfValidator,
  type OutputUnit,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import { getValueByPath } from "@sjsf/form/lib/object";
import {
  ID_KEY,
  prefixSchemaRefs,
  refToPath,
  ROOT_SCHEMA_PREFIX,
  type Path,
  type SchemaValue,
  type Validator,
} from "@sjsf/form/core";
import {
  pathToId,
  type Config,
  type Schema,
  type FieldValueValidator,
  type FormValueValidator,
  type UiSchemaRoot,
  type IdPrefixOption,
  type IdSeparatorOption,
  getRootSchemaTitleByPath,
  type FormValue,
  getRootUiSchemaTitleByPath,
} from "@sjsf/form";

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => SchemaValue;
}
export interface ValidatorOptions extends ValueToJSON {
  createSchemaValidator: (schema: Schema, rootSchema: Schema) => CfValidator;
}

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
    if (usePrefixSchemaRefs && lastRootSchema.deref() !== rootSchema) {
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
  const cache = new WeakMap<Schema, CfValidator>();
  const makeValidator = weakMemoize<Schema, CfValidator>(cache, factory);
  return (config: Config) => makeValidator(config.schema);
}

export function createValidator({
  createSchemaValidator,
  valueToJSON,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, rootSchema, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validator = createSchemaValidator(schemaDef, rootSchema);
      return validator.validate(valueToJSON(formValue)).valid;
    },
  };
}

interface ErrorsTransformerOptions extends IdPrefixOption, IdSeparatorOption {
  uiSchema?: UiSchemaRoot;
}

function createErrorsTransformer(options: ErrorsTransformerOptions) {
  const extractPropertyTitle = (
    unit: OutputUnit,
    rootSchema: Schema,
    path: Path,
    instanceId: string
  ): string => {
    const title = getRootUiSchemaTitleByPath(options.uiSchema ?? {}, path);
    if (title !== undefined) {
      return title;
    }
    const schemaPath = refToPath(unit.keywordLocation).slice(0, -1);
    const schema = getValueByPath(rootSchema, schemaPath);
    if (
      schema &&
      typeof schema === "object" &&
      "title" in schema &&
      typeof schema.title === "string"
    ) {
      return schema.title;
    }
    return (
      getRootSchemaTitleByPath(rootSchema, path) ??
      path[path.length - 1]?.toString() ??
      instanceId
    );
  };
  return (rootSchema: Schema, errors: OutputUnit[]) =>
    errors.map((unit) => {
      const path = refToPath(unit.instanceLocation);
      const instanceId = pathToId(path, options);
      return {
        instanceId,
        propertyTitle: extractPropertyTitle(unit, rootSchema, path, instanceId),
        message: unit.error,
        error: unit,
      };
    });
}

export interface FormValueValidatorOptions
  extends ValidatorOptions,
    ErrorsTransformerOptions {}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator<OutputUnit> {
  const errorsTransformer = createErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      return errorsTransformer(
        rootSchema,
        validator.validate(options.valueToJSON(formValue)).errors
      );
    },
  };
}

export interface FieldValueValidatorOptions extends ValueToJSON {
  createFieldSchemaValidator: (config: Config) => CfValidator;
}

function isRootError(error: OutputUnit): boolean {
  return error.instanceLocation === "#";
}

function isRootNonTypeError(error: OutputUnit): boolean {
  return isRootError(error) && error.keyword !== "type";
}

export function createFieldValueValidator({
  createFieldSchemaValidator,
  valueToJSON,
}: FieldValueValidatorOptions): FieldValueValidator<OutputUnit> {
  return {
    validateFieldValue(config, fieldValue) {
      const validator = createFieldSchemaValidator(config);
      const errors = validator.validate(valueToJSON(fieldValue)).errors;
      return errors
        .filter(config.required ? isRootError : isRootNonTypeError)
        .map((unit) => ({
          instanceId: config.id,
          propertyTitle: config.title,
          message: unit.error,
          error: unit,
        }));
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator({
  factory = (schema) => new CfValidator(schema as CfSchema, "7", false),
  createSchemaValidator = createSchemaValidatorFactory(factory),
  createFieldSchemaValidator = createFieldSchemaValidatorFactory(factory),
  valueToJSON = (v) =>
    v === undefined || v === null
      ? null
      : typeof v === "object"
      ? JSON.parse(JSON.stringify(v))
      : v,
  ...rest
}: Partial<FormValidatorOptions> & {
  factory?: CfValidatorFactory;
} = {}) {
  const options: FormValidatorOptions = {
    ...rest,
    valueToJSON,
    createSchemaValidator,
    createFieldSchemaValidator,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator(options),
    createFieldValueValidator(options)
  );
}

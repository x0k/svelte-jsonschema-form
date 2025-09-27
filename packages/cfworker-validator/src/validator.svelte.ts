import {
  Validator as CfValidator,
  type OutputUnit,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import {
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type SchemaValue,
  type Validator,
  pathFromLocation,
} from "@sjsf/form/core";
import type {
  Config,
  Schema,
  FieldValueValidator,
  FormValueValidator,
  FormValue,
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

export interface FormValueValidatorOptions extends ValidatorOptions {}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator {
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      const { errors } = validator.validate(options.valueToJSON(formValue));
      return errors.map((unit) => {
        const path = pathFromLocation(unit.instanceLocation, formValue);
        return {
          path,
          message: unit.error,
        };
      });
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
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(config, fieldValue) {
      const validator = createFieldSchemaValidator(config);
      const errors = validator.validate(valueToJSON(fieldValue)).errors;
      return errors
        .filter(config.required ? isRootError : isRootNonTypeError)
        .map((unit) => unit.error);
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

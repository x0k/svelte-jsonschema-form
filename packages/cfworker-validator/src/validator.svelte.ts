import {
  Validator as CfValidator,
  type OutputUnit,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import type {
  Config,
  Schema,
  FieldValueValidator,
  FormValueValidator,
  FormValue,
} from "@sjsf/form";
import {
  DATA_URL_FORMAT,
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type SchemaValue,
  type Validator,
  pathFromLocation,
} from "@sjsf/form/core";
import { memoize, weakMemoize, type MapLike } from "@sjsf/form/lib/memoize";

const COLOR_FORMAT_REGEX =
  /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/;

const DATA_URL_FORMAT_REGEX =
  /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/;

export type FormatChecker = (value: string) => boolean;

export type FormatRegistry = Record<string, FormatChecker>;

export function setupFormFormats(registry: FormatRegistry) {
  registry.color = (value) => COLOR_FORMAT_REGEX.test(value);
  registry[DATA_URL_FORMAT] = (value) => DATA_URL_FORMAT_REGEX.test(value);
}

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => SchemaValue;
}
export interface ValidatorOptions extends ValueToJSON {
  createSchemaValidator: (schema: Schema, rootSchema: Schema) => CfValidator;
}

export type CfValidatorFactory = (schema: Schema) => CfValidator;

export const defaultValidatorFactory: CfValidatorFactory = (schema) =>
  new CfValidator(schema as CfSchema, "7", false);

export type ValidatorsCache = MapLike<Schema, CfValidator>;

export function createSchemaValidatorFactory(
  factory: CfValidatorFactory,
  validatorsCache: ValidatorsCache = new WeakMap()
) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  let lastRootSchema: WeakRef<Schema> = new WeakRef({});
  const makeValidator = memoize<Schema, CfValidator>(
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

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      const { valid, errors } = validator.validate(
        options.valueToJSON(formValue)
      );
      if (valid) {
        return {
          value: formValue as T,
        };
      }
      return {
        value: formValue,
        errors: errors.map((unit) => {
          const path = pathFromLocation(unit.instanceLocation, formValue);
          return {
            path,
            message: unit.error,
          };
        }),
      };
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
  extends
    ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator<T>({
  factory = defaultValidatorFactory,
  validatorsCache,
  createSchemaValidator = createSchemaValidatorFactory(
    factory,
    validatorsCache
  ),
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
  validatorsCache?: ValidatorsCache;
} = {}) {
  const options: FormValidatorOptions = {
    ...rest,
    valueToJSON,
    createSchemaValidator,
    createFieldSchemaValidator,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator<T>(options),
    createFieldValueValidator(options)
  );
}

import type {
  Config,
  FieldValueValidator,
  FormValue,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import {
  DATA_URL_FORMAT,
  ID_KEY,
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
} from "@sjsf/form/core";
import { memoize, weakMemoize, type MapLike } from "@sjsf/form/lib/memoize";
import {
  Validator as AtaValidator,
  type ValidatorOptions as AtaValidatorOptions,
} from "ata-validator";

import { createFormErrorsTransformer, transformFieldErrors } from "./errors.js";
import type { Schemas } from "./model.js";

// https://github.com/rjsf-team/react-jsonschema-form/pull/5063#issuecomment-4413555901
export interface ValueCloner {
  cloneValue: (value: FormValue) => FormValue;
}

export type AtaValidatorFactory = (schema: Schema) => AtaValidator;

export const COLOR_FORMAT_REGEX =
  /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/;

export const DATA_URL_FORMAT_REGEX =
  /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/;

export const DEFAULT_VALIDATOR_OPTIONS = {
  verbose: true,
  formats: {
    color: (str) => COLOR_FORMAT_REGEX.test(str),
    [DATA_URL_FORMAT]: (str) => DATA_URL_FORMAT_REGEX.test(str),
  },
} satisfies AtaValidatorOptions;

export const defaultValidatorFactory: AtaValidatorFactory = (schema) =>
  new AtaValidator(
    Object.assign(
      { $schema: "http://json-schema.org/draft-07/schema#" },
      schema
    ),
    DEFAULT_VALIDATOR_OPTIONS
  );

export type ValidatorsCache = MapLike<Schema, AtaValidator>;

export function createSchemaValidatorFactory(
  factory: AtaValidatorFactory,
  rootSchema: Schema,
  validatorsCache: ValidatorsCache = new WeakMap()
) {
  const rootSchemaId = rootSchema[ID_KEY] ?? ROOT_SCHEMA_PREFIX;
  const rootSchemaWithId = { ...rootSchema, $id: rootSchemaId };
  const rootValidator = factory(rootSchemaWithId);
  const createValidator = memoize<Schema, AtaValidator>(
    validatorsCache,
    (schema) => {
      const validator = factory(prefixSchemaRefs(schema, rootSchemaId));
      validator.addSchema(rootSchemaWithId);
      return validator;
    }
  );
  return (schema: Schema) =>
    schema === rootSchema ? rootValidator : createValidator(schema);
}

export function createFieldSchemaValidatorFactory(
  factory: AtaValidatorFactory,
  cache = new WeakMap<Schema, AtaValidator>()
) {
  const makeValidator = weakMemoize(cache, factory);
  return (config: Config) => makeValidator(config.schema);
}

export interface ValidatorOptions extends ValueCloner {
  createSchemaValidator: (schema: Schema) => AtaValidator;
}

export function createValidator({
  createSchemaValidator,
  cloneValue,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validator = createSchemaValidator(schemaDef);
      return validator.isValidObject(cloneValue(formValue));
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions, Schemas, ValueCloner {}

export function createFormValueValidator<T>({
  createSchemaValidator,
  cloneValue,
  schema,
  uiSchema = {},
}: FormValueValidatorOptions): FormValueValidator<T> {
  const validator = createSchemaValidator(schema);
  const transformErrors = createFormErrorsTransformer(schema, uiSchema);
  return {
    validateFormValue(formValue) {
      const { valid, errors } = validator.validate(cloneValue(formValue));
      if (valid) {
        return {
          value: formValue as T,
        };
      }
      return transformErrors(errors, formValue);
    },
  };
}

export interface FieldValueValidatorOptions extends ValueCloner {
  compileFieldSchema: (config: Config) => AtaValidator;
}

export function createFieldValueValidator({
  compileFieldSchema,
  cloneValue,
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const validator = compileFieldSchema(field);
      const { valid, errors } = validator.validate(cloneValue(fieldValue));
      if (valid) {
        return [];
      }
      return transformFieldErrors(field, errors);
    },
  };
}

export interface FormValidatorOptions
  extends
    ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator<T>({
  schema,
  factory = defaultValidatorFactory,
  schemaValidatorsCache,
  fieldsValidatorsCache,
  createSchemaValidator = createSchemaValidatorFactory(
    factory,
    schema,
    schemaValidatorsCache
  ),
  compileFieldSchema = createFieldSchemaValidatorFactory(
    factory,
    fieldsValidatorsCache
  ),
  cloneValue = (value) => $state.snapshot(value),
  ...rest
}: Partial<FormValidatorOptions> & {
  schema: Schema;
  factory?: AtaValidatorFactory;
  schemaValidatorsCache?: ValidatorsCache;
  fieldsValidatorsCache?: WeakMap<Schema, AtaValidator>;
}) {
  const options: FormValidatorOptions = {
    ...rest,
    cloneValue,
    createSchemaValidator,
    compileFieldSchema,
    schema,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator<T>(options),
    createFieldValueValidator(options)
  );
}

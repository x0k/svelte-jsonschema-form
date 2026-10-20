import type {
  Config,
  FieldValueValidator,
  FormValue,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import { ID_KEY, prefixSchemaRefs, ROOT_SCHEMA_PREFIX } from "@sjsf/form/core";
import { memoize, weakMemoize, type MapLike } from "@sjsf/form/lib/memoize";
import { Validator as AtaValidator } from "ata-validator";

import {
  createFormErrorsTransformer,
  transformFieldErrors,
  type ErrorsTransformerOptions,
} from "./errors.js";
import { DEFAULT_VALIDATOR_OPTIONS } from "./model.js";

// https://github.com/rjsf-team/react-jsonschema-form/pull/5063#issuecomment-4413555901
export interface ValueCloner {
  cloneValue: (value: FormValue) => FormValue;
}

export type AtaValidatorFactory = (schema: Schema) => AtaValidator;

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
  validatorsCache: ValidatorsCache = new WeakMap()
) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  let lastRootSchema: WeakRef<Schema> = new WeakRef({});
  const makeValidator = memoize<Schema, AtaValidator>(
    validatorsCache,
    (schema) => {
      return factory(
        usePrefixSchemaRefs ? prefixSchemaRefs(schema, rootSchemaId) : schema
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
        Object.assign({ [ID_KEY]: rootSchemaId }, rootSchema)
      );
    }
    return validator;
  };
}

export function createFieldSchemaValidatorFactory(
  factory: AtaValidatorFactory,
  cache = new WeakMap<Schema, AtaValidator>()
) {
  const makeValidator = weakMemoize(cache, factory);
  return (config: Config) => makeValidator(config.schema);
}

export interface ValidatorOptions extends ValueCloner {
  createSchemaValidator: (schema: Schema, rootSchema: Schema) => AtaValidator;
}

export function createValidator({
  createSchemaValidator,
  cloneValue,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, rootSchema, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validator = createSchemaValidator(schemaDef, rootSchema);
      return validator.isValidObject(cloneValue(formValue));
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions, ErrorsTransformerOptions, ValueCloner {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      const { valid, errors } = validator.validate(
        options.cloneValue(formValue)
      );
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
  factory = defaultValidatorFactory,
  schemaValidatorsCache,
  fieldsValidatorsCache,
  createSchemaValidator = createSchemaValidatorFactory(
    factory,
    schemaValidatorsCache
  ),
  compileFieldSchema = createFieldSchemaValidatorFactory(
    factory,
    fieldsValidatorsCache
  ),
  cloneValue = (value) => $state.snapshot(value),
  ...rest
}: Partial<FormValidatorOptions> & {
  factory?: AtaValidatorFactory;
  schemaValidatorsCache?: ValidatorsCache;
  fieldsValidatorsCache?: WeakMap<Schema, AtaValidator>;
} = {}) {
  const options: FormValidatorOptions = {
    ...rest,
    cloneValue,
    createSchemaValidator,
    compileFieldSchema,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator<T>(options),
    createFieldValueValidator(options)
  );
}

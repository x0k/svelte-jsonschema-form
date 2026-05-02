import type {
  Config,
  FieldValueValidator,
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

export type AtaValidatorFactory = (schema: Schema) => AtaValidator;

export const defaultValidatorFactory: AtaValidatorFactory = (schema) =>
  new AtaValidator(
    Object.assign(
      { $schema: "http://json-schema.org/draft-07/schema#" },
      schema,
    ),
  );

export type ValidatorsCache = MapLike<Schema, AtaValidator>;

export function createSchemaValidatorFactory(
  factory: AtaValidatorFactory,
  validatorsCache: ValidatorsCache = new WeakMap(),
) {
  let rootSchemaId = "";
  let usePrefixSchemaRefs = false;
  let lastRootSchema: WeakRef<Schema> = new WeakRef({});
  const makeValidator = memoize<Schema, AtaValidator>(
    validatorsCache,
    (schema) => {
      return factory(
        usePrefixSchemaRefs ? prefixSchemaRefs(schema, rootSchemaId) : schema,
      );
    },
  );
  return (schema: Schema, rootSchema: Schema) => {
    rootSchemaId = rootSchema[ID_KEY] ?? ROOT_SCHEMA_PREFIX;
    usePrefixSchemaRefs = schema !== rootSchema;
    const validator = makeValidator(schema);
    if (usePrefixSchemaRefs && lastRootSchema.deref() !== rootSchema) {
      lastRootSchema = new WeakRef(rootSchema);
      validator.addSchema(
        Object.assign({ [ID_KEY]: rootSchemaId }, rootSchema),
      );
    }
    return validator;
  };
}

export function createFieldSchemaValidatorFactory(
  factory: AtaValidatorFactory,
  cache = new WeakMap<Schema, AtaValidator>(),
) {
  const makeValidator = weakMemoize(cache, factory);
  return (config: Config) => makeValidator(config.schema);
}

export interface ValidatorOptions {
  createSchemaValidator: (schema: Schema, rootSchema: Schema) => AtaValidator;
}

export function createValidator({
  createSchemaValidator,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, rootSchema, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validator = createSchemaValidator(schemaDef, rootSchema);
      return validator.isValidObject(formValue);
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions, ErrorsTransformerOptions {}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions,
): FormValueValidator<T> {
  const transformErrors = createFormErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      const { valid, errors } = validator.validate(formValue);
      if (valid) {
        return {
          value: formValue as T,
        };
      }
      return transformErrors(errors, formValue);
    },
  };
}

export interface FieldValueValidatorOptions {
  compileFieldSchema: (config: Config) => AtaValidator;
}

export function createFieldValueValidator({
  compileFieldSchema,
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const validator = compileFieldSchema(field);
      const { valid, errors } = validator.validate(fieldValue);
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
    schemaValidatorsCache,
  ),
  compileFieldSchema = createFieldSchemaValidatorFactory(
    factory,
    fieldsValidatorsCache,
  ),
  ...rest
}: Partial<FormValidatorOptions> & {
  factory?: AtaValidatorFactory;
  schemaValidatorsCache?: ValidatorsCache;
  fieldsValidatorsCache?: WeakMap<Schema, AtaValidator>;
} = {}) {
  const options: FormValidatorOptions = {
    ...rest,
    createSchemaValidator,
    compileFieldSchema,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator<T>(options),
    createFieldValueValidator(options),
  );
}

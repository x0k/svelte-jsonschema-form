import {
  validator,
  type Schema as SafeSchema,
  type Json,
  type Validate,
  type ValidationError,
} from "@exodus/schemasafe";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import { prefixSchemaRefs, ROOT_SCHEMA_PREFIX } from "@sjsf/form/core";
import type {
  Config,
  FieldValueValidator,
  FormValue,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";

import {
  createErrorMessage,
  createErrorsTransformer,
  transformError,
  type ErrorsTransformerOptions,
} from "./errors.js";
import { DEFAULT_VALIDATOR_OPTIONS } from './model.js';

export type ValidateFactory = (schema: Schema, rootSchema: Schema) => Validate;

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => Json;
}

export interface ValidatorOptions extends ValueToJSON {
  createSchemaValidator: (schema: Schema, rootSchema: Schema) => Validate;
}

export function createSchemaValidatorFactory(factory: ValidateFactory) {
  let usePrefixSchemaRefs = false;
  let lastRootSchemaRef: WeakRef<Schema> = new WeakRef({});
  const factoryCall = (schema: Schema) =>
    factory(
      usePrefixSchemaRefs
        ? prefixSchemaRefs(schema, ROOT_SCHEMA_PREFIX)
        : schema,
      lastRootSchemaRef.deref()!
    );
  let makeValidator = weakMemoize(new WeakMap<Schema, Validate>(), factoryCall);
  return (schema: Schema, rootSchema: Schema) => {
    usePrefixSchemaRefs = schema !== rootSchema;
    if (lastRootSchemaRef.deref() !== rootSchema) {
      lastRootSchemaRef = new WeakRef(rootSchema);
      makeValidator = weakMemoize(new WeakMap<Schema, Validate>(), factoryCall);
    }
    return makeValidator(schema);
  };
}

// TODO: By default each field will `retrieve` its own schema,
// so it should be impossible to run into `$ref`, but it would be nice to test
// this with a recursive schema.
export function createFieldsValidatorFactory(factory: ValidateFactory) {
  const cache = new WeakMap<Schema, Validate>();
  const rootSchema: Schema = {};
  const makeValidator = weakMemoize(cache, (schema: Schema) =>
    factory(schema, rootSchema)
  );
  return (config: Config) => makeValidator(config.schema);
}

export function createValidator({
  createSchemaValidator,
  valueToJSON,
}: ValidatorOptions): Validator {
  return {
    isValid(schema, rootSchema, formValue) {
      if (typeof schema === "boolean") {
        return schema;
      }
      const validator = createSchemaValidator(schema, rootSchema);
      return validator(valueToJSON(formValue));
    },
  };
}

export interface FormValueValidatorOptions
  extends ValidatorOptions,
    ErrorsTransformerOptions {}

export function createFormValueValidator(
  options: FormValueValidatorOptions
): FormValueValidator<ValidationError> {
  const transform = createErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      validator(options.valueToJSON(formValue));
      return validator.errors ? transform(rootSchema, validator.errors) : [];
    },
  };
}

export interface FieldValueValidatorOptions extends ValueToJSON {
  createFieldSchemaValidator: (config: Config) => Validate;
}

export function createFieldValueValidator({
  createFieldSchemaValidator,
  valueToJSON,
}: FieldValueValidatorOptions): FieldValueValidator<ValidationError> {
  return {
    validateFieldValue(field, fieldValue) {
      const validate = createFieldSchemaValidator(field);
      validate(valueToJSON(fieldValue));
      return (
        validate.errors?.map((error) => {
          const { keyword } = transformError(error);
          return {
            instanceId: field.id,
            propertyTitle: field.title,
            message: createErrorMessage(
              keyword,
              keyword in field.schema
                ? String(field.schema[keyword as keyof Schema])
                : undefined
            ),
            error,
          };
        }) ?? []
      );
    },
  };
}

export interface FormValidatorOptions
  extends ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator({
  factory = (schema, rootSchema) =>
    validator(schema as SafeSchema, {
      ...DEFAULT_VALIDATOR_OPTIONS,
      schemas: {
        [ROOT_SCHEMA_PREFIX]: rootSchema as SafeSchema,
      },
    }),
  createSchemaValidator = createSchemaValidatorFactory(factory),
  createFieldSchemaValidator = createFieldsValidatorFactory(factory),
  // `isJSON` validator option is `false` by default
  valueToJSON = (value) => value as Json,
  ...rest
}: Partial<FormValidatorOptions> & {
  factory?: ValidateFactory;
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

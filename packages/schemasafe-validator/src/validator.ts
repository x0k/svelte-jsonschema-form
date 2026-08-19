import {
  validator,
  type Schema as SafeSchema,
  type Json,
  type Validate,
} from "@exodus/schemasafe";
import type {
  Config,
  FieldValueValidator,
  FormValue,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";
import {
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type Merger,
} from "@sjsf/form/core";
import { memoize, type MapLike } from "@sjsf/form/lib/memoize";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import { DEFAULT_VALIDATOR_OPTIONS } from "./model.js";

function getRootSchemaId(schema: Schema): string {
  return schema.$id ?? ROOT_SCHEMA_PREFIX;
}

export type ValidateFactory = (schema: Schema) => Validate;

export const createDefaultValidateFactory = (
  rootSchema: Schema
): ValidateFactory => {
  const rootSchemaId = getRootSchemaId(rootSchema);
  return (schema) =>
    validator(schema as SafeSchema, {
      ...DEFAULT_VALIDATOR_OPTIONS,
      schemas: {
        [rootSchemaId]: rootSchema as SafeSchema,
      },
    });
};

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => Json;
}

export interface ValidatorOptions extends ValueToJSON {
  createSchemaValidator: (schema: Schema) => Validate;
}

export type ValidatorsCache = MapLike<Schema, Validate>;

export function createSchemaValidatorFactory(
  factory: (schema: Schema) => Validate,
  rootSchema: Schema,
  validatorsCache: ValidatorsCache = new WeakMap()
) {
  const rootSchemaId = getRootSchemaId(rootSchema);
  const rootValidator = factory(rootSchema);
  const makeValidator = memoize(validatorsCache, (schema: Schema) =>
    factory(prefixSchemaRefs(schema, rootSchemaId))
  );
  return (schema: Schema): Validate =>
    schema === rootSchema ? rootValidator : makeValidator(schema);
}

// TODO: By default each field will `retrieve` its own schema,
// so it should be impossible to run into `$ref`, but it would be nice to test
// this with a recursive schema.
export function createFieldSchemaValidatorFactory(
  factory: (schema: Schema) => Validate,
  rootSchema: Schema,
  cache: ValidatorsCache = new WeakMap()
) {
  const rootSchemaId = getRootSchemaId(rootSchema);
  const makeValidator = memoize<Schema, Validate>(cache, (schema) =>
    factory(prefixSchemaRefs(schema, rootSchemaId))
  );
  return (config: Config) => makeValidator(config.schema);
}

export function createValidator({
  createSchemaValidator,
  valueToJSON,
}: ValidatorOptions): Validator {
  return {
    isValid(schemaDef, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validate = createSchemaValidator(schemaDef);
      return validate(valueToJSON(formValue));
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {
  merger: () => Merger;
  schema: Schema;
}

export function createFormValueValidator<T>(
  options: FormValueValidatorOptions
): FormValueValidator<T> {
  const validate = options.createSchemaValidator(options.schema);
  const validator = createValidator(options);
  return {
    validateFormValue(formValue) {
      validate(options.valueToJSON(formValue));
      return transformFormErrors(
        validator,
        options.merger(),
        options.schema,
        validate.errors,
        formValue
      );
    },
  };
}

export interface FieldValueValidatorOptions extends ValueToJSON {
  createFieldSchemaValidator: (config: Config) => Validate;
}

export function createFieldValueValidator({
  createFieldSchemaValidator,
  valueToJSON,
}: FieldValueValidatorOptions): FieldValueValidator {
  return {
    validateFieldValue(field, fieldValue) {
      const validate = createFieldSchemaValidator(field);
      validate(valueToJSON(fieldValue));
      return transformFieldErrors(field, validate.errors, fieldValue);
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
  merger,
  factory = createDefaultValidateFactory(schema),
  validatorsCache,
  createSchemaValidator = createSchemaValidatorFactory(
    factory,
    schema,
    validatorsCache
  ),
  createFieldSchemaValidator = createFieldSchemaValidatorFactory(
    factory,
    schema,
    validatorsCache
  ),
  // `isJSON` validator option is `false` by default
  valueToJSON = (value) => value as Json,
  ...rest
}: Partial<FormValidatorOptions> & {
  schema: Schema;
  merger: () => Merger;
  factory?: ValidateFactory;
  validatorsCache?: ValidatorsCache;
}) {
  const options: FormValidatorOptions = {
    ...rest,
    schema,
    merger,
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

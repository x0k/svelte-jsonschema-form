import {
  validator,
  type Schema as SafeSchema,
  type Json,
  type Validate,
} from "@exodus/schemasafe";
import { weakMemoize } from "@sjsf/form/lib/memoize";
import {
  prefixSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type Merger,
} from "@sjsf/form/core";
import type {
  Config,
  FieldValueValidator,
  FormValue,
  FormValueValidator,
  Schema,
  Validator,
} from "@sjsf/form";

import { transformFormErrors, transformFieldErrors } from "./errors.js";
import { DEFAULT_VALIDATOR_OPTIONS } from "./model.js";

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

export interface FormValueValidatorOptions extends ValidatorOptions {
  merger: () => Merger;
}

export function createFormValueValidator<I, O>(
  options: FormValueValidatorOptions
): FormValueValidator<I, O> {
  return {
    validateFormValue(rootSchema, formValue) {
      const validate = options.createSchemaValidator(rootSchema, rootSchema);
      validate(options.valueToJSON(formValue));
      return transformFormErrors(
        createValidator(options),
        options.merger(),
        rootSchema,
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
  extends ValidatorOptions,
    FormValueValidatorOptions,
    FieldValueValidatorOptions {}

export function createFormValidator<I, O = I>({
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
  merger: () => Merger;
}) {
  const options: FormValidatorOptions = {
    ...rest,
    valueToJSON,
    createSchemaValidator,
    createFieldSchemaValidator,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator<I, O>(options),
    createFieldValueValidator(options)
  );
}

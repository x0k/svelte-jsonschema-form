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
  ID_KEY,
  updateSchemaRefs,
  ROOT_SCHEMA_PREFIX,
  type SchemaDefinition,
  type SchemaValue,
  type Validator,
  pathFromLocation,
} from "@sjsf/form/core";
import { transformSchemaDefinition } from "@sjsf/form/lib/json-schema";
import { memoize, weakMemoize, type MapLike } from "@sjsf/form/lib/memoize";

export interface ValueToJSON {
  valueToJSON: (value: FormValue) => SchemaValue;
}
export interface ValidatorOptions extends ValueToJSON {
  createSchemaValidator: (schema: Schema) => CfValidator;
}

export type CfValidatorFactory = (schema: Schema) => CfValidator;

export const defaultValidatorFactory: CfValidatorFactory = (schema) =>
  new CfValidator(schema as CfSchema, "7", false);

// Reserved id under which the root schema is registered into every subschema
// validator. It lives in the `__sjsf_` namespace so it can never collide with a
// user-defined `$id` carried by a subschema fragment.
const CFWORKER_ROOT_REF_ID = `${ROOT_SCHEMA_PREFIX}_cfworker_ref`;

export type ValidatorsCache = MapLike<Schema, CfValidator>;

export function createSchemaValidatorFactory(
  factory: CfValidatorFactory,
  rootSchema: Schema,
  validatorsCache: ValidatorsCache = new WeakMap()
) {
  // Register the root schema under a reserved, unique id (`rootRefId`) and point
  // every subschema's rewritten refs at it. cfworker keys its `lookup` by
  // absolute URI (`base#pointer`). Relative `$id`s (e.g. "bar") always resolve
  // to the same host-root URI no matter the base, so the root's own `$id`s are
  // redeclared with unique reserved values. This keeps the root and each
  // subschema in disjoint URI namespaces — no `$id` can ever collide, even
  // when a subschema is a clone of the root or carries the root's nested `$id`s.
  // Non-local `$ref`s of subschema fragments that point at the root's original
  // ids are rewritten via `idRewrites`.
  const rootRefId = CFWORKER_ROOT_REF_ID;
  let refIndex = 0;
  const idRewrites = new Map<string, string>();
  const rootSnapshot = $state.snapshot(rootSchema);
  if (typeof rootSnapshot !== "boolean" && rootSnapshot.$id !== undefined) {
    idRewrites.set(rootSnapshot.$id, rootRefId);
  }
  const rootRefSchema = transformSchemaDefinition(
    rootSnapshot,
    (copy, ctx): SchemaDefinition => {
      if (typeof copy !== "boolean") {
        if (ctx.type === "root") {
          copy.$id = rootRefId;
        } else if (copy[ID_KEY] !== undefined) {
          const newId = `${rootRefId}_${refIndex++}`;
          idRewrites.set(copy[ID_KEY], newId);
          copy.$id = newId;
        }
      }
      return copy;
    }
  );
  const rootValidator = factory(rootSnapshot);
  const makeValidator = memoize<Schema, CfValidator>(
    validatorsCache,
    (schema) => {
      const withRefs = updateSchemaRefs($state.snapshot(schema), (ref) => {
        if (ref.startsWith("#")) {
          return `${rootRefId}${ref}`;
        }
        const hashIndex = ref.indexOf("#");
        const base = hashIndex === -1 ? ref : ref.slice(0, hashIndex);
        const newBase = idRewrites.get(base);
        if (newBase === undefined) {
          return ref;
        }
        return newBase + (hashIndex === -1 ? "" : ref.slice(hashIndex));
      });
      const validator = factory(withRefs);
      validator.addSchema(rootRefSchema as CfSchema);
      return validator;
    }
  );
  return (schema: Schema) =>
    schema === rootSchema ? rootValidator : makeValidator(schema);
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
    isValid(schemaDef, formValue) {
      if (typeof schemaDef === "boolean") {
        return schemaDef;
      }
      const validator = createSchemaValidator(schemaDef);
      return validator.validate(valueToJSON(formValue)).valid;
    },
  };
}

export interface FormValueValidatorOptions extends ValidatorOptions {
  schema: Schema;
}

export function createFormValueValidator<T>({
  createSchemaValidator,
  schema,
  valueToJSON,
}: FormValueValidatorOptions): FormValueValidator<T> {
  const validator = createSchemaValidator(schema);
  return {
    validateFormValue(formValue) {
      const { valid, errors } = validator.validate(valueToJSON(formValue));
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
  schema,
  factory = defaultValidatorFactory,
  validatorsCache,
  createSchemaValidator = createSchemaValidatorFactory(
    factory,
    schema,
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
  schema: Schema;
  factory?: CfValidatorFactory;
  validatorsCache?: ValidatorsCache;
}) {
  const options: FormValidatorOptions = {
    ...rest,
    schema,
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

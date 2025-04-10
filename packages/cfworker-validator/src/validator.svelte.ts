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
  ROOT_SCHEMA_PREFIX,
  type Validator,
} from "@sjsf/form/core";
import {
  getUiSchemaByPath,
  pathToId,
  type Config,
  type Schema,
  type FieldValueValidator,
  type FormValueValidator,
  type UiSchemaRoot,
  type IdPrefixOption,
  type IdSeparatorOption,
  getRootSchemaTitleByPath,
} from "@sjsf/form";

export interface ValidatorOptions {
  createSchemaValidator: (schema: Schema, rootSchema: Schema) => CfValidator;
}

const FIELD_NOT_REQUIRED: string[] = [];

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
    if (usePrefixSchemaRefs && lastRootSchema?.deref() !== rootSchema) {
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
  let fieldTitle = "";
  let isRequired = false;
  const validatorsCache = new WeakMap<Schema, CfValidator>();
  const requiredCache = new WeakMap<Schema, boolean>();
  const makeValidator = weakMemoize<Schema, CfValidator>(
    validatorsCache,
    (schema) =>
      factory({
        type: "object",
        properties: {
          [fieldTitle]: schema,
        },
        required: isRequired ? [fieldTitle] : FIELD_NOT_REQUIRED,
      })
  );
  return (config: Config) => {
    fieldTitle = config.title;
    isRequired = config.required;
    const prev = requiredCache.get(config.schema);
    if (prev !== isRequired) {
      validatorsCache.delete(config.schema);
      requiredCache.set(config.schema, isRequired);
    }
    return makeValidator(config.schema);
  };
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
      return validator.validate(formValue).valid;
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
    path: string[],
    instanceId: string
  ): string => {
    const instanceUiSchema = getUiSchemaByPath(options.uiSchema, path);
    const uiTitle = instanceUiSchema?.["ui:options"]?.title;
    if (uiTitle) {
      return uiTitle;
    }
    let schemaPath = unit.keywordLocation.split("/");
    schemaPath = schemaPath.slice(1, -1);
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
      path[path.length - 1] ??
      instanceId
    );
  };
  return (rootSchema: Schema, errors: OutputUnit[]) =>
    errors.map((unit) => {
      let path = unit.instanceLocation.split("/");
      if (path[0] === "#") {
        path = path.slice(1);
      }
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
  return {
    validateFormValue(rootSchema, formValue) {
      const validator = options.createSchemaValidator(rootSchema, rootSchema);
      const errorsTransformer = createErrorsTransformer(options);
      return errorsTransformer(
        rootSchema,
        validator.validate(formValue).errors
      );
    },
  };
}

export interface FieldValueValidatorOptions {
  createFieldSchemaValidator: (config: Config) => CfValidator;
}

export function createFieldValueValidator({
  createFieldSchemaValidator,
}: FieldValueValidatorOptions): FieldValueValidator<OutputUnit> {
  return {
    validateFieldValue(config, fieldValue) {
      const validator = createFieldSchemaValidator(config);
      const errors = validator.validate(
        fieldValue === undefined ? {} : { [config.title]: fieldValue }
      ).errors;
      return errors
        .filter((error) => error.instanceLocation === `#/${config.title}`)
        .map((unit) => {
          return {
            instanceId: config.id,
            propertyTitle: config.title,
            message: unit.error,
            error: unit,
          };
        });
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
  ...rest
}: Partial<FormValidatorOptions> & {
  factory?: CfValidatorFactory;
} = {}) {
  const options: FormValidatorOptions = {
    ...rest,
    createSchemaValidator,
    createFieldSchemaValidator,
  };
  return Object.assign(
    createValidator(options),
    createFormValueValidator(options),
    createFieldValueValidator(options)
  );
}

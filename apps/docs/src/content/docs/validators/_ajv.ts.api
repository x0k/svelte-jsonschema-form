import type { Options, Ajv, ValidateFunction, AsyncValidateFunction } from "ajv";
import type { UiSchemaRoot, Schema, Config } from '@sjsf/form'
import type { AsyncValidator, Validator } from '@sjsf/ajv8-validator'

interface AbstractValidatorOptions {
  ajv: Ajv;
  /**
   * Necessary for correct inference of the field title
   * @default {}
   */
  uiSchema?: UiSchemaRoot;
  /** @default DEFAULT_ID_PREFIX */
  idPrefix?: string;
  /** @default DEFAULT_ID_SEPARATOR */
  idSeparator?: string;
  /** @default DEFAULT_PSEUDO_ID_SEPARATOR */
  idPseudoSeparator?: string;
}

interface ValidatorOptions extends AbstractValidatorOptions {
  /** @default makeSchemaCompiler(ajv, false) */
  compileSchema?: (schema: Schema, rootSchema: Schema) => ValidateFunction;
  /** @default makeFieldSchemaCompiler(ajv, false) */
  compileFieldSchema?: (config: Config) => ValidateFunction;
}

type FactoryOptions<O> = Omit<O, "ajv"> & {
  /** @default DEFAULT_AJV_CONFIG */
  ajvOptions?: Options;
  /** @default addFormComponents(new Ajv(ajvOptions)) */
  ajv?: Ajv;
};

function createValidator2(options?: FactoryOptions<ValidatorOptions>): Validator

interface AsyncValidatorOptions extends AbstractValidatorOptions {
  /** @default makeSchemaCompiler(ajv, false) */
  compileSchema?: (schema: Schema, rootSchema: Schema) => ValidateFunction;
  /** @default makeSchemaCompiler(ajv, true) */
  compileAsyncSchema?: (
    schema: Schema,
    rootSchema: Schema
  ) => AsyncValidateFunction;
  /** @default makeFieldSchemaCompiler(ajv, true) */
  compileAsyncFieldSchema?: (config: Config) => AsyncValidateFunction;
}

function createAsyncValidator(options?: FactoryOptions<AsyncValidatorOptions>): AsyncValidator

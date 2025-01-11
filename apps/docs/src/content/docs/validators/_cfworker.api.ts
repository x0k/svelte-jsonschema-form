import type { Validator as CfValidator } from "@cfworker/json-schema";
import type { Schema, UiSchemaRoot, Config } from "@sjsf/form";
import type { Validator } from '@sjsf/cfworker-validator'

type CfValidatorFactory = (schema: Schema) => CfValidator;

interface ValidatorOptions {
  factory: CfValidatorFactory;
  /** @default {} */
  uiSchema?: UiSchemaRoot;
  /** @default DEFAULT_ID_PREFIX */
  idPrefix?: string;
  /** @default DEFAULT_ID_SEPARATOR */
  idSeparator?: string;
  /** @default makeValidatorFactory(factory) */
  createValidator?: (schema: Schema, rootSchema: Schema) => CfValidator;
  /** @default makeFieldValidatorFactory(factory) */
  createFieldValidator?: (config: Config) => CfValidator;
}

type ValidatorFactoryOptions = Omit<ValidatorOptions, "factory"> & {
  /** @default () => new CfValidator(schema, "7", false) */
  factory?: CfValidatorFactory;
};

function createValidator(options?: ValidatorFactoryOptions): Validator

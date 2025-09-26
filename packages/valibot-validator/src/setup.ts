import type { Schema, Validator } from "@sjsf/form";
import { toJsonSchema } from "@valibot/to-json-schema";

import type { SchemaRegistry, ValibotSchema } from "./model.js";
import { createSchemaRegistry } from "./schemas-registry.js";
import {
  createAsyncFormValidator,
  createFormValidator,
  type AsyncFormValidatorOptions,
  type FormValidatorOptions,
} from "./validator.js";
import type { ErrorsTransformerOptions } from "./errors.js";

export interface CreateFormValidatorFactoryOptions<O, V extends Validator> {
  createFormValidator: (registry: SchemaRegistry, options: O) => V;
}

function createFormValidatorFactory<O, V extends Validator>({
  createFormValidator,
}: CreateFormValidatorFactoryOptions<O, V>) {
  return (
    valibotSchema: ValibotSchema
  ): {
    schemaRegistry: ReturnType<typeof createSchemaRegistry>;
    createValidator: (options: O) => V;
    schema: Schema;
  } => {
    const schemaRegistry = createSchemaRegistry();
    const schema = toJsonSchema(valibotSchema, {
      overrideSchema: schemaRegistry.register,
      typeMode: "input",
    }) as Schema;
    return {
      schemaRegistry,
      schema,
      createValidator: (options) =>
        createFormValidator(schemaRegistry, options),
    };
  };
}

export const adapt = createFormValidatorFactory({
  createFormValidator: (
    schemaRegistry,
    options: Partial<
      Omit<FormValidatorOptions, keyof ErrorsTransformerOptions>
    > &
      ErrorsTransformerOptions
  ) =>
    createFormValidator(
      Object.setPrototypeOf(
        { schemaRegistry } satisfies Omit<
          FormValidatorOptions,
          keyof ErrorsTransformerOptions
        >,
        options
      )
    ),
});

// TODO: Remove in v4
/** @deprecated use `adapt` */
export const setupFormValidator = adapt;

export const adaptAsync = createFormValidatorFactory({
  createFormValidator: (
    schemaRegistry,
    options: Partial<
      Omit<FormValidatorOptions, keyof ErrorsTransformerOptions>
    > &
      ErrorsTransformerOptions
  ) =>
    createAsyncFormValidator(
      Object.setPrototypeOf(
        { schemaRegistry } satisfies Omit<
          AsyncFormValidatorOptions,
          keyof ErrorsTransformerOptions
        >,
        options
      )
    ),
});

// TODO: Remove in v4
/** @deprecated use `adaptAsync` */
export const setupAsyncFormValidator = adaptAsync;

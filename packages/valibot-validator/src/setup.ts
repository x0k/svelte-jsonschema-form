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

export interface CreateFormValidatorFactoryOptions<O, V extends Validator> {
  createFormValidator: (registry: SchemaRegistry, options: Partial<O>) => V;
}

function createFormValidatorFactory<O, V extends Validator>({
  createFormValidator,
}: CreateFormValidatorFactoryOptions<O, V>) {
  return (
    valibotSchema: ValibotSchema
  ): {
    schemaRegistry: ReturnType<typeof createSchemaRegistry>;
    createValidator: (options?: Partial<O>) => V;
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
      createValidator: (options = {}) =>
        createFormValidator(schemaRegistry, options),
    };
  };
}

export const adapt = createFormValidatorFactory({
  createFormValidator: (
    schemaRegistry,
    options: Omit<FormValidatorOptions, "schemaRegistry">
  ) =>
    createFormValidator(
      Object.setPrototypeOf(
        { schemaRegistry } satisfies FormValidatorOptions,
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
    options: Omit<FormValidatorOptions, "schemaRegistry">
  ) =>
    createAsyncFormValidator(
      Object.setPrototypeOf(
        { schemaRegistry } satisfies AsyncFormValidatorOptions,
        options
      )
    ),
});

// TODO: Remove in v4
/** @deprecated use `adaptAsync` */
export const setupAsyncFormValidator = adaptAsync;

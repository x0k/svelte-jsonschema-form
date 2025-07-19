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
    valibotSchema: ValibotSchema,
    options: Partial<O> = {}
  ): {
    schemaRegistry: ReturnType<typeof createSchemaRegistry>;
    validator: V;
    schema: Schema;
  } => {
    const schemaRegistry = createSchemaRegistry();
    const validator = createFormValidator(schemaRegistry, options);
    const schema = toJsonSchema(valibotSchema, {
      overrideSchema: schemaRegistry.register,
      typeMode: "input",
    }) as Schema;
    return { schemaRegistry, validator, schema };
  };
}

export const setupFormValidator = createFormValidatorFactory({
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

export const setupAsyncFormValidator = createFormValidatorFactory({
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

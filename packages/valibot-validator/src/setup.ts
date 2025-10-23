import type { FormValidator, Schema, Validator } from "@sjsf/form";
import { toJsonSchema } from "@valibot/to-json-schema";

import type { SchemaRegistry, ValibotSchema } from "./model.js";
import { createSchemaRegistry } from "./schemas-registry.js";
import {
  createAsyncFormValidator,
  createFormValidator,
  type AsyncFormValidatorOptions,
  type FormValidatorOptions,
} from "./validator.js";
import type { InferOutput } from "valibot";

export interface CreateFormValidatorFactoryOptions<O> {
  createFormValidator: <S extends ValibotSchema, V extends FormValidator<S>>(
    schema: S,
    registry: SchemaRegistry,
    options: Partial<O>
  ) => V;
}

function createFormValidatorFactory<O>({
  createFormValidator,
}: CreateFormValidatorFactoryOptions<O>) {
  return <S extends ValibotSchema>(valibotSchema: S) => {
    const schemaRegistry = createSchemaRegistry();
    const schema = toJsonSchema(valibotSchema, {
      overrideSchema: schemaRegistry.register,
      typeMode: "input",
    }) as Schema;
    return {
      schemaRegistry,
      schema,
      validator: (options = {}) =>
        createFormValidator(valibotSchema, schemaRegistry, options),
    } as const;
  };
}

export const adapt = createFormValidatorFactory<
  Omit<FormValidatorOptions, "schemaRegistry">
>({
  createFormValidator: (s, schemaRegistry, options) =>
    createFormValidator<InferOutput<typeof s>>(
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
  createFormValidator: <Output>(
    schemaRegistry: SchemaRegistry,
    options: Omit<FormValidatorOptions, "schemaRegistry">
  ) =>
    createAsyncFormValidator<Output>(
      Object.setPrototypeOf(
        { schemaRegistry } satisfies AsyncFormValidatorOptions,
        options
      )
    ),
});

// TODO: Remove in v4
/** @deprecated use `adaptAsync` */
export const setupAsyncFormValidator = adaptAsync;

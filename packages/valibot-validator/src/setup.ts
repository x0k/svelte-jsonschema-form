import type { FormValidator, Schema } from "@sjsf/form";
import { toJsonSchema } from "@valibot/to-json-schema";
import type { InferOutput } from "valibot";

import type { SchemaRegistry, ValibotSchema } from "./model.js";
import { createSchemaRegistry } from "./schemas-registry.js";
import {
  createAsyncFormValidator,
  createFormValidator,
  type AsyncFormValidatorOptions,
  type FormValidatorOptions,
} from "./validator.js";

export interface CreateFormValidatorFactoryOptions<
  F extends <S extends ValibotSchema>(
    registry: SchemaRegistry
  ) => (options: Partial<Record<string, any>>) => FormValidator<InferOutput<S>>,
> {
  createFormValidator: F;
}

function createFormValidatorFactory<
  F extends <S extends ValibotSchema>(
    registry: SchemaRegistry
  ) => (options: Partial<Record<string, any>>) => FormValidator<InferOutput<S>>,
>({ createFormValidator }: CreateFormValidatorFactoryOptions<F>) {
  return <S extends ValibotSchema>(valibotSchema: S) => {
    const schemaRegistry = createSchemaRegistry();
    const schema = toJsonSchema(valibotSchema, {
      overrideSchema: schemaRegistry.register,
      typeMode: "input",
    }) as Schema;
    return {
      schemaRegistry,
      schema,
      validator: createFormValidator(schemaRegistry),
    };
  };
}

function createSyncValidator<S extends ValibotSchema>(
  schemaRegistry: SchemaRegistry
) {
  return (options: Omit<FormValidatorOptions, "schemaRegistry"> = {}) =>
    createFormValidator<InferOutput<S>>(
      Object.setPrototypeOf(
        { schemaRegistry } satisfies FormValidatorOptions,
        options
      )
    );
}

const _adapt = createFormValidatorFactory({
  createFormValidator: createSyncValidator,
});

export const adapt = _adapt as unknown as <S extends ValibotSchema>(
  schema: S
) => {
  schema: Schema;
  schemaRegistry: SchemaRegistry;
  validator: ReturnType<typeof createSyncValidator<S>>;
};

// TODO: Remove in v4
/** @deprecated use `adapt` */
export const setupFormValidator = adapt;

function createAsyncValidator<S extends ValibotSchema>(
  schemaRegistry: SchemaRegistry
) {
  return (options: Omit<AsyncFormValidatorOptions, "schemaRegistry"> = {}) =>
    createAsyncFormValidator<InferOutput<S>>(
      Object.setPrototypeOf(
        { schemaRegistry } satisfies AsyncFormValidatorOptions,
        options
      )
    );
}

const _adaptAsync = createFormValidatorFactory({
  createFormValidator: createAsyncValidator,
});

export const adaptAsync = _adaptAsync as unknown as <S extends ValibotSchema>(
  schema: S
) => {
  schema: Schema;
  schemaRegistry: SchemaRegistry;
  validator: ReturnType<typeof createAsyncValidator<S>>;
};

// TODO: Remove in v4
/** @deprecated use `adaptAsync` */
export const setupAsyncFormValidator = adaptAsync;

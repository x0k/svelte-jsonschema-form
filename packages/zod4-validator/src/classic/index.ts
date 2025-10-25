import type { Schema } from "@sjsf/form";
import type { $ZodType, output as InferOutput } from "zod/v4/core";
import { safeParse, safeParseAsync, ZodObject } from "zod";

import type { AugmentedSchemaFactory, SchemaRegistry } from "../model.js";
import {
  createAsyncFormValidator,
  createFormValidator,
  type AsyncFormValidatorOptions,
  type FormValidatorOptions,
} from "../validator.js";
import { createFormValidatorFactory } from "../setup.js";

export const createAugmentedSchema: AugmentedSchemaFactory = (schema) => {
  // TODO: Turn records into partial records
  if (!(schema instanceof ZodObject)) {
    return;
  }
  return schema
    .partial()
    .refine((obj) =>
      Object.keys(schema.shape).some(
        (key) => obj[key as keyof typeof obj] !== undefined
      )
    );
};

function createSyncValidator<S extends $ZodType>(
  schemaRegistry: SchemaRegistry
) {
  return (
    options: Omit<FormValidatorOptions, "schemaRegistry" | "safeParse"> = {}
  ) =>
    createFormValidator<InferOutput<S>>(
      Object.setPrototypeOf(
        {
          safeParse,
          schemaRegistry,
        } satisfies FormValidatorOptions,
        options
      )
    );
}

const _adapt = createFormValidatorFactory({
  createAugmentedSchema,
  createFormValidator: createSyncValidator,
});

export const adapt = _adapt as unknown as <S extends $ZodType>(
  zodSchema: S
) => {
  schema: Schema;
  schemaRegistry: SchemaRegistry;
  validator: ReturnType<typeof createSyncValidator<S>>;
};

// TODO: Remove in v4
/** @deprecated use `adapt` */
export const setupFormValidator = adapt;

function createAsyncValidator<S extends $ZodType>(
  schemaRegistry: SchemaRegistry
) {
  return (
    options: Omit<
      FormValidatorOptions,
      "schemaRegistry" | "safeParse" | "safeParseAsync"
    > = {}
  ) =>
    createAsyncFormValidator<InferOutput<S>>(
      Object.setPrototypeOf(
        {
          safeParse,
          safeParseAsync,
          schemaRegistry,
        } satisfies AsyncFormValidatorOptions,
        options
      )
    );
}

const _adaptAsync = createFormValidatorFactory({
  createAugmentedSchema,
  createFormValidator: createAsyncValidator,
});

export const adaptAsync = _adaptAsync as unknown as <S extends $ZodType>(
  zodSchema: S
) => {
  schema: Schema;
  schemaRegistry: SchemaRegistry;
  validator: ReturnType<typeof createAsyncValidator<S>>;
};

// TODO: Remove in v4
/** @deprecated use `adaptAsync` */
export const setupAsyncFormValidator = adaptAsync;

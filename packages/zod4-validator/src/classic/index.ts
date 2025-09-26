import { safeParse, safeParseAsync, ZodObject } from "zod";

import type { AugmentedSchemaFactory } from "../model.js";
import {
  createAsyncFormValidator,
  createFormValidator,
  type AsyncFormValidatorOptions,
  type FormValidatorOptions,
} from "../validator.js";
import { createFormValidatorFactory } from "../setup.js";
import type { ErrorsTransformerOptions } from "../errors.js";

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

export const adapt = createFormValidatorFactory({
  createAugmentedSchema,
  createFormValidator: (
    schemaRegistry,
    options: Partial<
      Omit<FormValidatorOptions, keyof ErrorsTransformerOptions>
    > &
      ErrorsTransformerOptions
  ) =>
    createFormValidator(
      Object.setPrototypeOf(
        {
          safeParse,
          schemaRegistry,
        } satisfies Omit<FormValidatorOptions, keyof ErrorsTransformerOptions>,
        options
      )
    ),
});

// TODO: Remove in v4
/** @deprecated use `adapt` */
export const setupFormValidator = adapt;

export const adaptAsync = createFormValidatorFactory({
  createAugmentedSchema,
  createFormValidator: (
    schemaRegistry,
    options: Partial<
      Omit<FormValidatorOptions, keyof ErrorsTransformerOptions>
    > &
      ErrorsTransformerOptions
  ) =>
    createAsyncFormValidator(
      Object.setPrototypeOf(
        {
          safeParse,
          safeParseAsync,
          schemaRegistry,
        } satisfies Omit<
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

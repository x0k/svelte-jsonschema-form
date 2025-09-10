import type { Schema } from "@sjsf/form";
import { ZodMiniObject, partial, safeParse, safeParseAsync } from "zod/mini";

import type { AugmentedSchemaFactory } from "../model.js";
import { createSchemaRegistry } from "../schemas-registry.js";
import {
  createAsyncFormValidator,
  createFormValidator,
  type AsyncFormValidatorOptions,
  type FormValidatorOptions,
} from "../validator.js";
import { createFormValidatorFactory } from "../setup.js";

export const createAugmentedSchema: AugmentedSchemaFactory = (schema) => {
  // TODO: Turn records into partial records
  if (!(schema instanceof ZodMiniObject)) {
    return;
  }
  return partial(schema).check((ctx) => {
    if (
      Object.keys(schema.def.shape).some(
        (key) => ctx.value[key as keyof typeof ctx.value] !== undefined
      )
    ) {
      return;
    }
    ctx.issues.push({
      code: "custom",
      message: "At least one property must be provided",
      input: ctx.value,
    });
  });
};

export const adapt = createFormValidatorFactory({
  createAugmentedSchema,
  createFormValidator: (
    schemaRegistry,
    options: Omit<FormValidatorOptions, "schemaRegistry" | "safeParse">
  ) =>
    createFormValidator(
      Object.setPrototypeOf(
        {
          safeParse,
          schemaRegistry,
        } satisfies FormValidatorOptions,
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
    options: Omit<
      FormValidatorOptions,
      "schemaRegistry" | "safeParse" | "safeParseAsync"
    >
  ) =>
    createAsyncFormValidator(
      Object.setPrototypeOf(
        {
          safeParse,
          safeParseAsync,
          schemaRegistry,
        } satisfies AsyncFormValidatorOptions,
        options
      )
    ),
});

// TODO: Remove in v4
/** @deprecated use `adaptAsync` */
export const setupAsyncFormValidator = adaptAsync
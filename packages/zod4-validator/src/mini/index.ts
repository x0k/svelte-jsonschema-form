import type { Schema } from "@sjsf/form";
import { ZodMiniObject, partial, safeParse, safeParseAsync } from "zod/v4-mini";

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

export const setupFormValidator = createFormValidatorFactory({
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

export const setupAsyncFormValidator = createFormValidatorFactory({
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

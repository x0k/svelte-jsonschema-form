import type { FormValidator, Schema } from "@sjsf/form";
import {
  toJSONSchema,
  type $ZodType,
  type output as InferOutput,
} from "zod/v4/core";

import type { AugmentedSchemaFactory, SchemaRegistry } from "./model.js";
import { createSchemaRegistry } from "./schemas-registry.js";

export interface CreateFormValidatorFactoryOptions<
  F extends <S extends $ZodType>(
    registry: SchemaRegistry
  ) => (options: Partial<Record<string, any>>) => FormValidator<InferOutput<S>>,
> {
  createAugmentedSchema: AugmentedSchemaFactory;
  createFormValidator: F;
}

export function createFormValidatorFactory<
  F extends <S extends $ZodType>(
    registry: SchemaRegistry
  ) => (options: Partial<Record<string, any>>) => FormValidator<InferOutput<S>>,
>({
  createFormValidator,
  createAugmentedSchema,
}: CreateFormValidatorFactoryOptions<F>) {
  return <S extends $ZodType>(
    zodSchema: S
  ): {
    schema: Schema;
    schemaRegistry: SchemaRegistry;
    validator: ReturnType<typeof createFormValidator<S>>;
  } => {
    const schemaRegistry = createSchemaRegistry({ createAugmentedSchema });
    const schema = toJSONSchema(zodSchema, {
      target: "draft-7",
      override: schemaRegistry.register,
      io: "input",
    }) as Schema;
    return {
      schemaRegistry,
      validator: createFormValidator(schemaRegistry),
      schema,
    };
  };
}

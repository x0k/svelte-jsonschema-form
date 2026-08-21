import type { FormValidator, Schema } from "@sjsf/form";
import {
  toJSONSchema,
  type $ZodType,
  type output as InferOutput,
} from "zod/v4/core";

import type {
  AugmentedSchemaFactory,
  ConditionSchemaFactory,
  SchemaRegistry,
} from "./model.js";
import { createSchemaRegistry } from "./schemas-registry.js";

export interface CreateFormValidatorFactoryOptions<
  F extends <S extends $ZodType>(
    registry: SchemaRegistry,
    rootSchema: Schema
  ) => (options: Partial<Record<string, any>>) => FormValidator<InferOutput<S>>,
> {
  createAugmentedSchema: AugmentedSchemaFactory;
  createConditionSchema: ConditionSchemaFactory;
  createFormValidator: F;
}

export function createFormValidatorFactory<
  F extends <S extends $ZodType>(
    registry: SchemaRegistry,
    rootSchema: Schema
  ) => (options: Partial<Record<string, any>>) => FormValidator<InferOutput<S>>,
>({
  createFormValidator,
  createAugmentedSchema,
  createConditionSchema,
}: CreateFormValidatorFactoryOptions<F>) {
  return <S extends $ZodType>(
    zodSchema: S
  ): {
    schema: Schema;
    schemaRegistry: SchemaRegistry;
    validator: ReturnType<typeof createFormValidator<S>>;
  } => {
    const schemaRegistry = createSchemaRegistry({
      createAugmentedSchema,
      createConditionSchema,
    });
    const schema = toJSONSchema(zodSchema, {
      target: "draft-7",
      override: schemaRegistry.register,
      io: "input",
      unrepresentable: "any",
    }) as Schema;
    return {
      schemaRegistry,
      validator: createFormValidator(schemaRegistry, schema),
      schema,
    };
  };
}

import type { Schema, Validator } from "@sjsf/form";
import { toJSONSchema, type $ZodType } from "zod/v4/core";

import type { AugmentedSchemaFactory, SchemaRegistry } from "./model.js";
import { createSchemaRegistry } from "./schemas-registry.js";

export interface CreateFormValidatorFactoryOptions<O, V extends Validator> {
  createAugmentedSchema: AugmentedSchemaFactory;
  createFormValidator: (registry: SchemaRegistry, options: Partial<O>) => V;
}

export function createFormValidatorFactory<O, V extends Validator>({
  createFormValidator,
  createAugmentedSchema,
}: CreateFormValidatorFactoryOptions<O, V>) {
  return (
    zodSchema: $ZodType
  ): {
    schemaRegistry: ReturnType<typeof createSchemaRegistry>;
    createValidator: (options?: Partial<O>) => V;
    schema: Schema;
  } => {
    const schemaRegistry = createSchemaRegistry({ createAugmentedSchema });
    const schema = toJSONSchema(zodSchema, {
      target: "draft-7",
      override: schemaRegistry.register,
      io: "input",
    }) as Schema;
    return {
      schemaRegistry,
      createValidator: (options = {}) =>
        createFormValidator(schemaRegistry, options),
      schema,
    };
  };
}

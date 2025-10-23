import type { FormValidator, Schema, Validator } from "@sjsf/form";
import {
  toJSONSchema,
  type $ZodType,
  type output as InferOutput,
} from "zod/v4/core";

import type { AugmentedSchemaFactory, SchemaRegistry } from "./model.js";
import { createSchemaRegistry } from "./schemas-registry.js";

export interface CreateFormValidatorFactoryOptions<O, V extends Validator> {
  createAugmentedSchema: AugmentedSchemaFactory;
  createFormValidator: (registry: SchemaRegistry, options: Partial<O>) => V;
}

export function createFormValidatorFactory<O, V extends FormValidator<any>>({
  createFormValidator,
  createAugmentedSchema,
}: CreateFormValidatorFactoryOptions<O, V>) {
  return <S extends $ZodType>(
    zodSchema: S
  ): {
    schemaRegistry: ReturnType<typeof createSchemaRegistry>;
    validator: (options?: Partial<O>) => V & FormValidator<InferOutput<S>>;
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
      validator: (options = {}) => createFormValidator(schemaRegistry, options),
      schema,
    };
  };
}

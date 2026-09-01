import type { Schema } from "@sjsf/form";
import {
  conditionSchemaEntries,
  DEFAULT_ID_AUGMENTATIONS,
  type IdAugmentations,
} from "@sjsf/form/validators/precompile";
import { type $ZodTypes, JSONSchema } from "zod/v4/core";

import {
  type AugmentedSchemaFactory,
  type ConditionSchemaFactory,
  type SchemaRegistry,
} from "./model.js";

export interface SchemaRegistryOptions {
  createAugmentedSchema: AugmentedSchemaFactory;
  createConditionSchema: ConditionSchemaFactory;
  map?: Map<string, $ZodTypes>;
  idAugmentations?: Partial<IdAugmentations>;
}

export function createSchemaRegistry({
  createAugmentedSchema,
  createConditionSchema,
  map = new Map(),
  idAugmentations,
}: SchemaRegistryOptions) {
  const augmentations = { ...DEFAULT_ID_AUGMENTATIONS, ...idAugmentations };
  return {
    get(id: string) {
      return map.get(id);
    },
    register({
      zodSchema,
      jsonSchema,
    }: {
      zodSchema: $ZodTypes;
      jsonSchema: JSONSchema.BaseSchema;
    }) {
      const id = map.size.toString();
      map.set(id, zodSchema);
      if (zodSchema._zod.def.type === "nullable") {
        const { anyOf } = jsonSchema;
        if (
          anyOf === undefined ||
          anyOf.length !== 2 ||
          anyOf[1]!.type !== "null"
        ) {
          throw new Error(
            `'{ anyOf: [<inner schema>, { type: "null" }] }' schema is expected for nullable zod schema, but got '${JSON.stringify(jsonSchema)}'`
          );
        }
        const innerSchema = anyOf[0];
        if (innerSchema === undefined || innerSchema.type === undefined) {
          throw new Error(
            "Your Zod schema is currently unsupported, please consider opening an issue with your example"
          );
        }
        // @ts-expect-error JSONSchema is too strict
        innerSchema.type = [innerSchema.type, "null"];
        for (const key of Object.keys(jsonSchema)) {
          delete jsonSchema[key];
        }
        Object.assign(jsonSchema, innerSchema);
      } else if (zodSchema._zod.def.type === "union") {
        const { anyOf } = jsonSchema;
        if (
          anyOf === undefined ||
          zodSchema._zod.def.options.length !== anyOf.length
        ) {
          throw new Error(
            `Expected 'anyOf' keyword for Zod union type, but got '${Object.keys(jsonSchema).join(", ")}'`
          );
        }
        for (let i = 0; i < anyOf.length; i++) {
          const option = zodSchema._zod.def.options[i]!;
          const augmentedSchema = createAugmentedSchema(option);
          if (augmentedSchema === undefined) {
            continue;
          }
          const { $id: id } = anyOf[i]!;
          if (id === undefined) {
            throw new Error(`Id for item of 'anyOf' item not found`);
          }
          map.set(augmentations.combination(id), augmentedSchema);
        }
      }
      // Register condition schemas for dependencies with oneOf
      for (const { dependencyKey, propertyId } of conditionSchemaEntries(
        jsonSchema as Schema
      )) {
        const propZodSchema = map.get(propertyId);
        if (propZodSchema === undefined) {
          continue;
        }
        const conditionSchema = createConditionSchema(
          dependencyKey,
          propZodSchema
        );
        map.set(augmentations.condition(propertyId), conditionSchema);
      }
      jsonSchema.$id = id;
    },
  } as const satisfies SchemaRegistry & { [K in PropertyKey]: any };
}

import { isSchema } from "@sjsf/form/core";
import type {
  JSONSchema7,
  OverrideSchemaContext,
} from "@valibot/to-json-schema";
import * as v from "valibot";

import {
  createAugmentedId,
  type SchemaRegistry,
  type ValibotJsonableSchema,
  type ValibotSchema,
} from "./model.js";

export interface SchemaRegistryOptions {
  map?: Map<string, ValibotSchema>;
}

function createAugmentedSchema(schema: ValibotJsonableSchema) {
  switch (schema.type) {
    case "object":
    case "object_with_rest":
    case "loose_object":
    case "strict_object":
      return v.pipe(
        v.partial(schema),
        v.check((obj) => {
          // Check if at least one key from the original schema is defined in the object
          return Object.keys(schema.entries).some(
            (key) => obj[key as keyof typeof obj] !== undefined
          );
        }, "At least one field must be defined")
      );
  }
}

export function createSchemaRegistry({
  map = new Map(),
}: SchemaRegistryOptions = {}) {
  return {
    get(id: string) {
      return map.get(id);
    },
    register({
      errors,
      jsonSchema,
      valibotSchema,
    }: OverrideSchemaContext): JSONSchema7 | undefined {
      if (errors !== undefined) {
        return;
      }
      const id = map.size.toString();
      map.set(id, valibotSchema);
      let result = { ...jsonSchema };
      const vSchema = valibotSchema as ValibotJsonableSchema;
      switch (vSchema.type) {
        case "nullable":
        case "nullish": {
          const { anyOf } = jsonSchema;
          if (
            anyOf === undefined ||
            anyOf.length !== 2 ||
            !isSchema(anyOf[1]!) ||
            anyOf[1]!.type !== "null"
          ) {
            throw new Error(
              `'{ anyOf: [<inner schema>, { type: "null" }] }' schema is expected for ${vSchema.type} Valibot schema, but got '${JSON.stringify(jsonSchema)}'`
            );
          }
          const innerSchema = anyOf[0];
          if (
            innerSchema === undefined ||
            !isSchema(innerSchema) ||
            innerSchema.type === undefined ||
            Array.isArray(innerSchema.type)
          ) {
            throw new Error(
              "Your Valibot schema is currently unsupported, please consider opening an issue with your example"
            );
          }
          result = { ...innerSchema, type: [innerSchema.type, "null"] };
          break;
        }
        case "union":
        case "variant": {
          const { anyOf } = jsonSchema;
          if (
            anyOf === undefined ||
            !anyOf.every(isSchema) ||
            vSchema.options.length !== anyOf.length
          ) {
            throw new Error(
              `Expected 'anyOf' keyword for Valibot ${vSchema.type} type, but got '${Object.keys(jsonSchema).join(", ")}'`
            );
          }
          for (let i = 0; i < anyOf.length; i++) {
            const option = vSchema.options[i]!;
            if ("pipe" in option) {
              throw new Error(`unions with pipes currently unsupported`);
            }
            const augmentedSchema = createAugmentedSchema(
              option as ValibotJsonableSchema
            );
            if (augmentedSchema === undefined) {
              continue;
            }
            const { $id: id } = anyOf[i]!;
            if (id === undefined) {
              throw new Error(`Id for item of 'anyOf' item not found`);
            }
            map.set(createAugmentedId(id), augmentedSchema);
          }
          break;
        }
      }
      result.$id = id;
      return result;
    },
  } as const satisfies SchemaRegistry & { [K in PropertyKey]: any };
}

import { escapeRegex } from "@/lib/reg-exp.js";
import {
  type SchemaDefinition,
  type Schema,
  transformSchemaDefinition,
} from "@/core/index.js";

export function createAdditionalPropertyKeyValidationSchema(
  schema: Schema,
  separators: string[]
): Schema {
  return transformSchemaDefinition<SchemaDefinition>(schema, (copy) => {
    if (typeof copy === "boolean") {
      return copy;
    }
    const { additionalProperties, propertyNames } = copy;
    if (
      additionalProperties === undefined ||
      typeof propertyNames === "boolean"
    ) {
      return copy;
    }
    const propertyPattern = {
      pattern: `^((?!(${separators.map(escapeRegex).join("|")})).)*$`,
    };
    copy.propertyNames = propertyNames
      ? {
          allOf: [propertyNames, propertyPattern],
        }
      : propertyPattern;

    return copy;
  }) as Schema;
}

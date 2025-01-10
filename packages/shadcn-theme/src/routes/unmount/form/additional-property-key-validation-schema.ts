import { escapeRegex } from "@sjsf/form/lib/reg-exp";
import {
  type SchemaDefinition,
  type Schema,
  transformSchemaDefinition,
} from "@sjsf/form/core";

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

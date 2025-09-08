import { weakMemoize } from "@/lib/memoize.js";
import { transformSchemaDefinition } from "@/lib/json-schema/index.js";
import {
  ADDITIONAL_PROPERTY_FLAG,
  type Schema,
  type SchemaDefinition,
} from "@/core/index.js";
import type { AdditionalPropertyKeyValidator, Config } from "@/form/main.js";

// This is an attempt to restore the original scheme for correct field validation
// TODO: Remove when we are not using custom schema properties
export function removeVirtualAdditionalProperties(schema: Schema): Schema {
  return transformSchemaDefinition(schema, (copy: SchemaDefinition) => {
    if (typeof copy === "boolean") {
      return copy;
    }
    const { properties } = copy;
    if (properties === undefined) {
      return copy;
    }
    for (const key of Object.keys(properties)) {
      const property = properties[key]!;
      if (typeof property === "boolean") {
        continue;
      }
      if (property[ADDITIONAL_PROPERTY_FLAG]) {
        // NOTE: properties also a copy
        delete properties[key];
      }
    }
    return copy;
  }) as Schema;
}

export function createVirtualAdditionalPropertiesRemover(
  cache = new WeakMap<Config, Config>()
) {
  return weakMemoize(cache, (config) => ({
    ...config,
    schema: removeVirtualAdditionalProperties(config.schema),
  }));
}

export interface ErrorFactoryOptions {
  key: string;
  patternProperties: Exclude<Schema["patternProperties"], undefined>;
}

export function createPatternPropertyKeyValidator(
  error: string | ((ctx: ErrorFactoryOptions) => string)
): AdditionalPropertyKeyValidator {
  return {
    validateAdditionalPropertyKey(
      key,
      { patternProperties, additionalProperties }
    ) {
      let patterns: string[];
      return patternProperties === undefined ||
        additionalProperties !== false ||
        ((patterns = Object.keys(patternProperties)), patterns.length === 0) ||
        patterns.some((k) => new RegExp(k).test(key))
        ? []
        : [
            typeof error === "string"
              ? error
              : error({ key, patternProperties }),
          ];
    },
  };
}

import { type Schema } from "@/core/index.js";
import type { AdditionalPropertyKeyValidator } from "@/form/main.js";

export interface ErrorFactoryOptions {
  key: string;
  patternProperties: Exclude<Schema["patternProperties"], undefined>;
}

export function createPatternPropertyKeyValidator(
  error: (ctx: ErrorFactoryOptions) => string
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
        : [error({ key, patternProperties })];
    },
  };
}

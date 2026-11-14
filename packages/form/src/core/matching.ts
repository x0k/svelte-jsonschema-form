// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getMatchingOption.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getClosestMatchingOption.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { weakMemoize } from "#lib/memoize.js";
import { getOwn } from "#lib/object.js";

import { isValid, type CoreContext } from "./context.js";
import {
  getDiscriminatorFieldFromSchema,
  getOptionMatchingSimpleDiscriminator,
} from "./discriminator.js";
import { resolveAllReferences, retrieveSchema } from "./resolve.js";
import {
  isSchemaWithProperties,
  REF_KEY,
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
  type SchemaWithProperties,
} from "./schema.js";
import { typeOfValue } from "./type.js";
import { isSchemaObjectValue } from "./value.js";
import { getXxxOfOptions } from "./xxx-of-options.js";

// WARN: Any change to this function must be synchronized with `validators/precompile`
export function createAugmentSchema({
  required,
  ...rest
}: SchemaWithProperties): Schema {
  return {
    allOf: [
      rest,
      {
        anyOf: Object.keys(rest.properties).map((key) => ({
          required: [key],
        })),
      },
    ],
  };
}

// Should increase cache hit for validators with cache based on weak map
export const AUGMENTED_SCHEMAS_CACHE = new WeakMap<
  SchemaWithProperties,
  Schema
>();
const memoizedAugmentSchema = weakMemoize(
  AUGMENTED_SCHEMAS_CACHE,
  createAugmentSchema
);

function isOptionMatching(
  ctx: CoreContext,
  option: SchemaDefinition,
  formData: SchemaValue,
  discriminatorField: string | undefined,
  discriminatorFormData: SchemaValue | undefined
): boolean {
  if (typeof option === "boolean") {
    return option;
  }
  if (!isSchemaWithProperties(option)) {
    return isValid(ctx, option, formData);
  }
  // WARN: Do not transform into `&&` expression!
  const discriminator =
    discriminatorField !== undefined
      ? option.properties[discriminatorField]
      : undefined;
  if (discriminator !== undefined) {
    return isValid(ctx, discriminator, discriminatorFormData);
  }
  return isValid(ctx, memoizedAugmentSchema(option), formData);
}

export function getFirstMatchingOption(
  ctx: CoreContext,
  formData: SchemaValue | undefined,
  options: SchemaDefinition[],
  discriminatorField?: string
): number {
  // For performance, skip validating subschemas if formData is undefined. We just
  // want to get the first option in that case.
  if (formData === undefined) {
    return 0;
  }

  const simpleDiscriminatorMatch = getOptionMatchingSimpleDiscriminator(
    formData,
    options,
    discriminatorField
  );
  if (simpleDiscriminatorMatch !== undefined) {
    return simpleDiscriminatorMatch;
  }

  const isDiscriminatorActual =
    isSchemaObjectValue(formData) && discriminatorField !== undefined;
  for (let i = 0; i < options.length; i++) {
    if (
      isOptionMatching(
        ctx,
        options[i]!,
        formData,
        isDiscriminatorActual ? discriminatorField : undefined,
        isDiscriminatorActual ? formData[discriminatorField] : undefined
      )
    ) {
      return i;
    }
  }
  return 0;
}

export function calculateIndexScore(
  ctx: CoreContext,
  schema?: SchemaDefinition,
  formData?: SchemaValue
): number {
  let totalScore = 0;
  if (typeof schema === "boolean") {
    return 0;
  }
  if (schema) {
    const schemaProperties = schema.properties;
    if (schemaProperties && isSchemaObjectValue(formData)) {
      for (const [key, propertySchema] of Object.entries(schemaProperties)) {
        // Read only own properties, so a recursive `$ref` under a name every
        // object inherits, such as `toString`, still sees the data run out.
        const formValue = getOwn(formData, key);
        if (typeof propertySchema === "boolean") {
          continue;
        }
        if (propertySchema[REF_KEY] !== undefined) {
          // A recursive `$ref` stays in place after resolution, so following it
          // without data would fabricate `{}` at every level and never
          // terminate. Descending past the data could only score its absence.
          if (formValue == null) {
            continue;
          }
          const newSchema = retrieveSchema(ctx, propertySchema, formValue);
          totalScore += calculateIndexScore(ctx, newSchema, formValue);
          continue;
        }
        const altSchemas = getXxxOfOptions(propertySchema)?.options;
        if (altSchemas !== undefined && formValue != null) {
          const discriminator = getDiscriminatorFieldFromSchema(propertySchema);
          totalScore += getClosestMatchingOption(
            ctx,
            formValue,
            altSchemas,
            -1,
            discriminator
          );
          continue;
        }
        if (propertySchema.type === "object") {
          if (isSchemaObjectValue(formValue)) {
            totalScore += 1;
          }
          totalScore += calculateIndexScore(ctx, propertySchema, formValue);
          continue;
        }
        if (
          formValue !== undefined &&
          propertySchema.type === typeOfValue(formValue)
        ) {
          // If the types match, then we bump the score by one
          totalScore += 1;
          if (propertySchema.default !== undefined) {
            totalScore += formValue === propertySchema.default ? 1 : -1;
          } else if (
            propertySchema.const !== undefined &&
            formValue !== undefined
          ) {
            totalScore += formValue === propertySchema.const ? 1 : -1;
          }
          // TODO eventually, deal with enums/arrays
          continue;
        }
      }
    } else if (
      formData !== undefined &&
      typeof schema.type === "string" &&
      schema.type === typeOfValue(formData)
    ) {
      totalScore += 1;
    }
  }
  return totalScore;
}

export function getClosestMatchingOption(
  ctx: CoreContext,
  formData: SchemaValue | undefined,
  options: SchemaDefinition[],
  selectedOption = -1,
  discriminatorField?: string
): number {
  if (options.length === 0) {
    return selectedOption;
  }
  // First resolve any refs in the options
  const resolvedOptions = options.map((option) =>
    typeof option === "boolean" ? option : resolveAllReferences(ctx, option)
  );

  const simpleDiscriminatorMatch = getOptionMatchingSimpleDiscriminator(
    formData,
    resolvedOptions,
    discriminatorField
  );
  if (simpleDiscriminatorMatch !== undefined) {
    return simpleDiscriminatorMatch;
  }

  const allValidIndexes: number[] = [];

  // For performance, skip validating subschemas if formData is undefined.
  if (formData !== undefined) {
    const canDiscriminatorBeApplied =
      isSchemaObjectValue(formData) && discriminatorField !== undefined;
    for (let i = 0; i < resolvedOptions.length; i++) {
      if (
        isOptionMatching(
          ctx,
          resolvedOptions[i]!,
          formData,
          canDiscriminatorBeApplied ? discriminatorField : undefined,
          canDiscriminatorBeApplied ? formData[discriminatorField] : undefined
        )
      ) {
        allValidIndexes.push(i);
      }
    }

    // There is only one valid index, so return it!
    if (allValidIndexes.length === 1) {
      return allValidIndexes[0]!;
    }
  }
  if (allValidIndexes.length === 0) {
    // No indexes were valid, so we'll score all the options, add all the indexes
    for (let i = 0; i < resolvedOptions.length; i++) {
      allValidIndexes.push(i);
    }
  }
  const scoreCount = new Set<number>();
  let bestScore = 0;
  let bestIndex = selectedOption;
  // Score all the options in the list of valid indexes and return the index with the best score
  for (let i = 0; i < allValidIndexes.length; i++) {
    const index = allValidIndexes[i]!;
    const option = resolvedOptions[index];
    const score = calculateIndexScore(ctx, option, formData);
    scoreCount.add(score);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }
  // if all scores are the same go with selectedOption
  if (
    allValidIndexes.length > 1 &&
    scoreCount.size === 1 &&
    selectedOption >= 0
  ) {
    return selectedOption;
  }

  return bestIndex;
}

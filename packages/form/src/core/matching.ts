// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getMatchingOption.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getClosestMatchingOption.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  getDiscriminatorFieldFromSchema,
  getOptionMatchingSimpleDiscriminator,
} from "./discriminator.js";
import type { Merger } from "./merger.js";
import { resolveAllReferences, retrieveSchema } from "./resolve.js";
import {
  isSchema,
  PROPERTIES_KEY,
  REF_KEY,
  type Schema,
  type SchemaValue,
} from "./schema.js";
import { typeOfValue } from "./type.js";
import type { Validator } from "./validator.js";
import { isSchemaObjectValue } from "./value.js";

// Should increase cache hit for validators with cache based on weak map
const AUGMENTED_SCHEMAS = new WeakMap<Schema, Schema>();

function isOptionMatching(
  option: Schema,
  validator: Validator,
  formData: SchemaValue,
  rootSchema: Schema,
  discriminatorField: string | undefined,
  discriminatorFormData: SchemaValue | undefined
): boolean {
  const optionProperties = option[PROPERTIES_KEY];
  // NOTE: This is possibly a bug since schema can be combinatorial (oneOf, anyOf)
  if (optionProperties === undefined) {
    return validator.isValid(option, rootSchema, formData);
  }
  const discriminator =
    discriminatorField !== undefined && optionProperties[discriminatorField];
  if (discriminator !== undefined) {
    return validator.isValid(discriminator, rootSchema, discriminatorFormData);
  }
  let augmentedSchema = AUGMENTED_SCHEMAS.get(option);
  if (augmentedSchema === undefined) {
    const { required, ...shallowCopy } = option;
    augmentedSchema = {
      allOf: [
        shallowCopy,
        {
          anyOf: Object.keys(optionProperties).map((key) => ({
            required: [key],
          })),
        },
      ],
    };
    AUGMENTED_SCHEMAS.set(option, augmentedSchema);
  }
  return validator.isValid(augmentedSchema, rootSchema, formData);
}

export function getFirstMatchingOption(
  validator: Validator,
  formData: SchemaValue | undefined,
  options: Schema[],
  rootSchema: Schema,
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
        options[i]!,
        validator,
        formData,
        rootSchema,
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
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  schema?: Schema,
  formData?: SchemaValue
): number {
  let totalScore = 0;
  if (schema) {
    const schemaProperties = schema.properties;
    if (schemaProperties && isSchemaObjectValue(formData)) {
      for (const [key, propertySchema] of Object.entries(schemaProperties)) {
        const formValue = formData[key];
        if (typeof propertySchema === "boolean") {
          continue;
        }
        if (propertySchema[REF_KEY] !== undefined) {
          const newSchema = retrieveSchema(
            validator,
            merger,
            propertySchema,
            rootSchema,
            formValue
          );
          totalScore += calculateIndexScore(
            validator,
            merger,
            rootSchema,
            newSchema,
            formValue
          );
          continue;
        }
        const altSchemas = propertySchema.oneOf || propertySchema.anyOf;
        if (altSchemas && formValue) {
          const discriminator = getDiscriminatorFieldFromSchema(propertySchema);
          totalScore += getClosestMatchingOption(
            validator,
            merger,
            rootSchema,
            formValue,
            altSchemas.filter(isSchema),
            -1,
            discriminator
          );
          continue;
        }
        if (propertySchema.type === "object") {
          if (isSchemaObjectValue(formValue)) {
            totalScore += 1;
          }
          totalScore += calculateIndexScore(
            validator,
            merger,
            rootSchema,
            propertySchema,
            formValue
          );
          continue;
        }
        if (
          formValue !== undefined &&
          propertySchema.type === typeOfValue(formValue)
        ) {
          // If the types match, then we bump the score by one
          totalScore += 1
          const defaultOrConst = propertySchema.default ?? propertySchema.const
          if (defaultOrConst !== undefined) {
            totalScore += formValue === defaultOrConst ? 1 : -1;
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
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  formData: SchemaValue | undefined,
  options: Schema[],
  selectedOption = -1,
  discriminatorField?: string
): number {
  if (options.length === 0) {
    return selectedOption;
  }
  // First resolve any refs in the options
  const resolvedOptions = options.map((option) => {
    return resolveAllReferences(option, rootSchema);
  });

  const simpleDiscriminatorMatch = getOptionMatchingSimpleDiscriminator(
    formData,
    options,
    discriminatorField
  );
  if (typeof simpleDiscriminatorMatch === "number") {
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
          resolvedOptions[i]!,
          validator,
          formData,
          rootSchema,
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
    const score = calculateIndexScore(
      validator,
      merger,
      rootSchema,
      option,
      formData
    );
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

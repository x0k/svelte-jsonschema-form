// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getMatchingOption.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getClosestMatchingOption.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { defaultMerger } from './default-merger.js';
import {
  getDiscriminatorFieldFromSchema,
  getOptionMatchingSimpleDiscriminator,
} from "./discriminator.js";
import type { Merger } from './merger.js';
import { resolveAllReferences, retrieveSchema2 } from "./resolve.js";
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

const JUNK_OPTION_ID = "_$junk_option_schema_id$_";
const JUNK_OPTION: Schema = {
  type: "object",
  $id: JUNK_OPTION_ID,
  properties: {
    __not_really_there__: {
      type: "number",
    },
  },
};

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
    isSchemaObjectValue(formData) && discriminatorField;
  for (let i = 0; i < options.length; i++) {
    const option = options[i]!;
    const optionProperties = option[PROPERTIES_KEY];
    if (optionProperties === undefined) {
      if (validator.isValid(option, rootSchema, formData)) {
        return i;
      }
      continue;
    }
    if (
      isDiscriminatorActual &&
      optionProperties[discriminatorField] !== undefined
    ) {
      const discriminator = optionProperties[discriminatorField];
      const value = formData[discriminatorField];
      if (validator.isValid(discriminator, rootSchema, value)) {
        return i;
      }
    }
    // If the schema describes an object then we need to add slightly more
    // strict matching to the schema, because unless the schema uses the
    // "requires" keyword, an object will match the schema as long as it
    // doesn't have matching keys with a conflicting type. To do this we use an
    // "anyOf" with an array of requires. This augmentation expresses that the
    // schema should match if any of the keys in the schema are present on the
    // object and pass validation.
    //
    // Create an "anyOf" schema that requires at least one of the keys in the
    // "properties" object
    const requiresAnyOf = {
      anyOf: Object.keys(optionProperties).map((key) => ({
        required: [key],
      })),
    };

    let augmentedSchema;

    // If the "anyOf" keyword already exists, wrap the augmentation in an "allOf"
    if (option.anyOf) {
      // Create a shallow clone of the option
      const { ...shallowClone } = option;

      if (!shallowClone.allOf) {
        shallowClone.allOf = [];
      } else {
        // If "allOf" already exists, shallow clone the array
        shallowClone.allOf = shallowClone.allOf.slice();
      }

      shallowClone.allOf.push(requiresAnyOf);

      augmentedSchema = shallowClone;
    } else {
      augmentedSchema = Object.assign({}, option, requiresAnyOf);
    }

    // Remove the "required" field as it's likely that not all fields have
    // been filled in yet, which will mean that the schema is not valid
    delete augmentedSchema.required;

    if (validator.isValid(augmentedSchema, rootSchema, formData)) {
      return i;
    }
  }
  return 0;
}

/**
 * @deprecated use `calculateIndexScore2`
 */
export function calculateIndexScore(
  validator: Validator,
  rootSchema: Schema,
  schema?: Schema,
  formData?: SchemaValue,
  merger: Merger = defaultMerger
): number {
  return calculateIndexScore2(validator, merger, rootSchema, schema, formData);
}

export function calculateIndexScore2(
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
          const newSchema = retrieveSchema2(
            validator,
            merger,
            propertySchema,
            rootSchema,
            formValue
          );
          totalScore += calculateIndexScore(
            validator,
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
          totalScore += 1;
          if (propertySchema.default !== undefined) {
            // If the schema contains a readonly default value score the value that matches the default higher and
            // any non-matching value lower
            totalScore += formValue === propertySchema.default ? 1 : -1;
          } else if (propertySchema.const !== undefined) {
            // If the schema contains a const value score the value that matches the default higher and
            // any non-matching value lower
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

/**
 * @deprecated use `getClosestMatchingOption2`
 */
export function getClosestMatchingOption(
  validator: Validator,
  rootSchema: Schema,
  formData: SchemaValue | undefined,
  options: Schema[],
  selectedOption = -1,
  discriminatorField?: string,
  merger: Merger = defaultMerger
): number {
  return getClosestMatchingOption2(
    validator,
    merger,
    rootSchema,
    formData,
    options,
    selectedOption,
    discriminatorField
  )
}

export function getClosestMatchingOption2(
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

  // Reduce the array of options down to a list of the indexes that are considered matching options
  const allValidIndexes: number[] = [];
  const testOptions = [JUNK_OPTION, {} as Schema];
  for (let i = 0; i < resolvedOptions.length; i++) {
    testOptions[1] = resolvedOptions[i]!;
    if (
      getFirstMatchingOption(
        validator,
        formData,
        testOptions,
        rootSchema,
        discriminatorField
      ) === 1
    ) {
      allValidIndexes.push(i);
    }
  }

  // There is only one valid index, so return it!
  if (allValidIndexes.length === 1) {
    return allValidIndexes[0]!;
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
    const score = calculateIndexScore2(validator, merger, rootSchema, option, formData);
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

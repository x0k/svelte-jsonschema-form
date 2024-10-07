// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getMatchingOption.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/getClosestMatchingOption.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  getDiscriminatorFieldFromSchema,
  getOptionMatchingSimpleDiscriminator,
} from "./discriminator";
import { resolveAllReferences, retrieveSchema } from "./resolve";
import {
  isSchema,
  PROPERTIES_KEY,
  REF_KEY,
  type Schema,
  type SchemaValue,
} from "./schema";
import { typeOfValue } from "./type";
import type { Validator } from "./validator";
import { isSchemaObjectValue } from "./value";

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
    const option = options[i];
    const optionProperties = option[PROPERTIES_KEY];
    if (optionProperties === undefined) {
      if (validator.isValid(option, rootSchema, formData)) {
        return i;
      }
      continue;
    }
    if (isDiscriminatorActual && discriminatorField in optionProperties) {
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

function calculateIndexScore(
  validator: Validator,
  rootSchema: Schema,
  schema?: Schema,
  formData: SchemaValue = {}
): number {
  let totalScore = 0;
  if (schema) {
    const schemaProperties = schema.properties;
    if (schemaProperties && isSchemaObjectValue(formData)) {
      for (const [key, value] of Object.entries(schemaProperties)) {
        const formValue = formData[key];
        if (typeof value === "boolean") {
          continue;
        }
        if (schema[REF_KEY] !== undefined) {
          const newSchema = retrieveSchema(
            validator,
            value,
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
        const altSchemas = value.oneOf || value.anyOf;
        if (altSchemas && formValue) {
          const discriminator = getDiscriminatorFieldFromSchema(value);
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
        if (value.type === "object") {
          totalScore += calculateIndexScore(
            validator,
            rootSchema,
            value,
            formValue
          );
          continue;
        }
        if (formValue !== undefined && value.type === typeOfValue(formValue)) {
          // If the types match, then we bump the score by one
          let newScore = 1;
          if (value.default !== undefined) {
            // If the schema contains a readonly default value score the value that matches the default higher and
            // any non-matching value lower
            newScore += formValue === value.default ? 1 : -1;
          } else if (value.const !== undefined) {
            // If the schema contains a const value score the value that matches the default higher and
            // any non-matching value lower
            newScore += formValue === value.const ? 1 : -1;
          }
          // TODO eventually, deal with enums/arrays
          totalScore += newScore;
          continue;
        }
      }
    } else if (
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
  rootSchema: Schema,
  formData: SchemaValue | undefined,
  options: Schema[],
  selectedOption = -1,
  discriminatorField?: string
): number {
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
  const allValidIndexes = resolvedOptions.reduce(
    (validList: number[], option, index: number) => {
      const testOptions = [JUNK_OPTION, option];
      const match = getFirstMatchingOption(
        validator,
        formData,
        testOptions,
        rootSchema,
        discriminatorField
      );
      // The match is the real option, so add its index to list of valid indexes
      if (match === 1) {
        validList.push(index);
      }
      return validList;
    },
    []
  );

  // There is only one valid index, so return it!
  if (allValidIndexes.length === 1) {
    return allValidIndexes[0];
  }
  if (!allValidIndexes.length) {
    // No indexes were valid, so we'll score all the options, add all the indexes
    for (let i = 0; i < resolvedOptions.length; i++) {
      allValidIndexes.push(i);
    }
  }
  type BestType = { bestIndex: number; bestScore: number };
  const scoreCount = new Set<number>();
  // Score all the options in the list of valid indexes and return the index with the best score
  const { bestIndex }: BestType = allValidIndexes.reduce(
    (scoreData: BestType, index: number) => {
      const { bestScore } = scoreData;
      const option = resolvedOptions[index];
      const score = calculateIndexScore(
        validator,
        rootSchema,
        option,
        formData
      );
      scoreCount.add(score);
      if (score > bestScore) {
        return { bestIndex: index, bestScore: score };
      }
      return scoreData;
    },
    { bestIndex: selectedOption, bestScore: 0 }
  );
  // if all scores are the same go with selectedOption
  if (scoreCount.size === 1 && selectedOption >= 0) {
    return selectedOption;
  }

  return bestIndex;
}

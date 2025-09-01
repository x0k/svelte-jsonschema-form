// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/mergeObjects.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { isNil } from "@/lib/types.js";

import {
  ARRAYS_OF_SUB_SCHEMAS,
  DEPENDENCIES_KEY,
  ITEMS_KEY,
  RECORDS_OF_SUB_SCHEMAS,
  REQUIRED_KEY,
  SUB_SCHEMAS,
  type Schema,
  type SchemaDefinition,
  type SchemaObjectValue,
} from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

function mergeRecords<T>(
  left: Record<string, T>,
  right: Record<string, T>,
  merge: (l: T, r: T) => T
) {
  const target = Object.assign({}, left);
  for (const [key, value] of Object.entries(right)) {
    if (left[key] === undefined) {
      target[key] = value;
      continue;
    }
    target[key] = merge(left[key], value);
  }
  return target;
}

interface MergeArraysOptions<T> {
  merge?: (l: T, r: T) => T;
  /**
   * @default false
   */
  unique?: boolean;
}

function mergeArrays<T>(
  left: T[],
  right: T[],
  { merge, unique }: MergeArraysOptions<T> = {}
) {
  let merged: T[];
  if (merge) {
    const [minArr, maxArr] =
      left.length <= right.length ? [left, right] : [right, left];
    merged = new Array(maxArr.length);
    for (let i = 0; i < minArr.length; i++) {
      merged[i] = merge(left[i]!, right[i]!);
    }
    for (let i = minArr.length; i < maxArr.length; i++) {
      merged[i] = maxArr[i]!;
    }
  } else {
    merged = left.concat(right);
  }
  return unique ? Array.from(new Set(merged)) : merged;
}

function mergeSchemaDefinitions(
  left: SchemaDefinition,
  right: SchemaDefinition,
  options: MergeSchemasOptions
) {
  if (typeof left === "boolean" || typeof right === "boolean") {
    return right;
  }
  return mergeSchemas(left, right, options);
}

function mergeSchemaDependencies(
  left: SchemaDefinition | string[],
  right: SchemaDefinition | string[],
  options: MergeSchemasOptions
) {
  if (Array.isArray(left) || Array.isArray(right)) {
    return right;
  }
  return mergeSchemaDefinitions(left, right, options);
}

export interface MergeSchemasOptions {
  /**
   * @default `concat`
   */
  arraySubSchemasMergeType?: "concat" | "override";
}

export function mergeSchemas(
  left: Schema,
  right: Schema,
  options: MergeSchemasOptions = {}
): Schema {
  const merged = Object.assign({}, left, right);
  for (const key of RECORDS_OF_SUB_SCHEMAS) {
    if (!(key in merged) || key === DEPENDENCIES_KEY) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = mergeRecords(l, r, (l, r) =>
        mergeSchemaDefinitions(l, r, options)
      );
    }
  }
  if (left[ITEMS_KEY] && right[ITEMS_KEY]) {
    merged[ITEMS_KEY] =
      isSchemaObjectValue(left[ITEMS_KEY]) &&
      isSchemaObjectValue(right[ITEMS_KEY])
        ? mergeSchemas(left[ITEMS_KEY], right[ITEMS_KEY], options)
        : right[ITEMS_KEY];
  }
  if (left[DEPENDENCIES_KEY] && right[DEPENDENCIES_KEY]) {
    merged[DEPENDENCIES_KEY] = mergeRecords(
      left[DEPENDENCIES_KEY],
      right[DEPENDENCIES_KEY],
      (l, r) => mergeSchemaDependencies(l, r, options)
    );
  }
  for (const key of SUB_SCHEMAS) {
    if (!(key in merged) || key === ITEMS_KEY) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = mergeSchemaDefinitions(l, r, options);
    }
  }
  for (const key of ARRAYS_OF_SUB_SCHEMAS) {
    if (!(key in merged) || key === ITEMS_KEY) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = mergeArrays(l, r, {
        merge:
          options.arraySubSchemasMergeType === "override"
            ? (l, r) => mergeSchemaDefinitions(l, r, options)
            : undefined,
      });
    }
  }
  if (left[REQUIRED_KEY] && right[REQUIRED_KEY]) {
    merged[REQUIRED_KEY] = mergeArrays(
      left[REQUIRED_KEY],
      right[REQUIRED_KEY],
      { unique: true }
    );
  }
  return merged;
}

export function mergeDefaultsWithFormData<T = any>(
  defaults?: T,
  formData?: T,
  mergeExtraArrayDefaults = false,
  defaultsSupersedesUndefined = false,
  overrideFormDataWithDefaults = false
): T | undefined {
  if (Array.isArray(formData)) {
    const defaultsArray = Array.isArray(defaults) ? defaults : [];

    // If overrideFormDataWithDefaults is true, we want to override the formData with the defaults
    const overrideArray = overrideFormDataWithDefaults
      ? defaultsArray
      : formData;
    const overrideOppositeArray = overrideFormDataWithDefaults
      ? formData
      : defaultsArray;

    const mapped = overrideArray.map((value, idx) => {
      if (overrideOppositeArray[idx] !== undefined) {
        return mergeDefaultsWithFormData<any>(
          defaultsArray[idx],
          formData[idx],
          mergeExtraArrayDefaults,
          defaultsSupersedesUndefined,
          overrideFormDataWithDefaults
        );
      }
      return value;
    });
    // Merge any extra defaults when mergeExtraArrayDefaults is true
    // Or when overrideFormDataWithDefaults is true and the default array is shorter than the formData array
    if (
      (mergeExtraArrayDefaults || overrideFormDataWithDefaults) &&
      mapped.length < overrideOppositeArray.length
    ) {
      mapped.push(...overrideOppositeArray.slice(mapped.length));
    }
    return mapped as unknown as T;
  }
  if (isSchemaObjectValue(formData)) {
    const acc: { [key in keyof T]: any } = Object.assign({}, defaults); // Prevent mutation of source object.
    const defaultsObject: SchemaObjectValue = isSchemaObjectValue(defaults)
      ? defaults
      : {};
    for (const [key, value] of Object.entries(formData)) {
      const keyExistsInDefaults = key in defaultsObject;
      const keyDefault = defaultsObject[key];

      // NOTE: This code is bad, but maintaining compatibility with RSJF > "good" code
      if (
        isSchemaObjectValue(keyDefault) &&
        isSchemaObjectValue(value) &&
        !Object.values(keyDefault).some(isSchemaObjectValue)
      ) {
        acc[key as keyof T] = {
          ...keyDefault,
          ...value,
        };
        continue;
      }

      acc[key as keyof T] = mergeDefaultsWithFormData(
        defaultsObject[key],
        value,
        mergeExtraArrayDefaults,
        defaultsSupersedesUndefined,
        // overrideFormDataWithDefaults can be true only when the key value exists in defaults
        // Or if the key value doesn't exist in formData
        // CHANGED: key is always in form data, maybe this condition should be value === undefined
        // overrideFormDataWithDefaults &&
        //   (keyExistsInDefaults || !keyExistsInFormData)
        overrideFormDataWithDefaults && keyExistsInDefaults
      );
    }
    return acc;
  }

  if (
    (defaultsSupersedesUndefined &&
      ((!(defaults === undefined) && isNil(formData)) ||
        (typeof formData === "number" && isNaN(formData)))) ||
    (overrideFormDataWithDefaults && !isNil(formData))
    // NOTE: The above condition is inherited from RJSF to maintain tests compatibility
    // but i would prefer more simple one
    // formData === undefined
    //   ? defaultsSupersedesUndefined && defaults !== undefined
    //   : overrideFormDataWithDefaults
  ) {
    return defaults;
  }
  return formData;
}

export function mergeSchemaObjects<
  A extends SchemaObjectValue,
  B extends SchemaObjectValue,
>(obj1: A, obj2: B, concatArrays: boolean | "preventDuplicates" = false) {
  const acc: SchemaObjectValue = Object.assign({}, obj1);
  for (const [key, right] of Object.entries(obj2)) {
    const left = obj1 ? obj1[key] : {};
    if (isSchemaObjectValue(left) && isSchemaObjectValue(right)) {
      acc[key] = mergeSchemaObjects(left, right, concatArrays);
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(
        concatArrays === "preventDuplicates"
          ? right.filter((v) => !left.includes(v))
          : right
      );
    } else {
      acc[key] = right;
    }
  }
  return acc as A & B;
}

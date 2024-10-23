// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/mergeObjects.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

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

function mergeArrays<T>(left: T[], right: T[], unique = false) {
  const merged = left.concat(right);
  return unique ? Array.from(new Set(merged)) : merged;
}

function mergeSchemaDefinitions(
  left: SchemaDefinition,
  right: SchemaDefinition
) {
  if (typeof left === "boolean" || typeof right === "boolean") {
    return right;
  }
  return mergeSchemas(left, right);
}

function mergeSchemaDependencies(
  left: SchemaDefinition | string[],
  right: SchemaDefinition | string[]
) {
  if (Array.isArray(left) || Array.isArray(right)) {
    return right;
  }
  return mergeSchemaDefinitions(left, right);
}

export function mergeSchemas(left: Schema, right: Schema): Schema {
  const merged = Object.assign({}, left, right);
  for (const key of RECORDS_OF_SUB_SCHEMAS) {
    if (!(key in merged) || key === DEPENDENCIES_KEY) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = mergeRecords(l, r, mergeSchemaDefinitions);
    }
  }
  if (left[ITEMS_KEY] && right[ITEMS_KEY]) {
    merged[ITEMS_KEY] =
      isSchemaObjectValue(left[ITEMS_KEY]) &&
      isSchemaObjectValue(right[ITEMS_KEY])
        ? mergeSchemas(left[ITEMS_KEY], right[ITEMS_KEY])
        : right[ITEMS_KEY];
  }
  if (left[DEPENDENCIES_KEY] && right[DEPENDENCIES_KEY]) {
    merged[DEPENDENCIES_KEY] = mergeRecords(
      left[DEPENDENCIES_KEY],
      right[DEPENDENCIES_KEY],
      mergeSchemaDependencies
    );
  }
  for (const key of SUB_SCHEMAS) {
    if (!(key in merged) || key === ITEMS_KEY) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = mergeSchemaDefinitions(l, r);
    }
  }
  for (const key of ARRAYS_OF_SUB_SCHEMAS) {
    if (!(key in merged) || key === ITEMS_KEY) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = l.concat(r);
    }
  }
  if (left[REQUIRED_KEY] && right[REQUIRED_KEY]) {
    merged[REQUIRED_KEY] = mergeArrays(
      left[REQUIRED_KEY],
      right[REQUIRED_KEY],
      true
    );
  }
  return merged;
}

export function mergeDefaultsWithFormData<T = any>(
  defaults?: T,
  formData?: T,
  mergeExtraArrayDefaults = false,
  defaultsSupersedesUndefined = false
): T | undefined {
  if (formData === undefined && defaultsSupersedesUndefined) {
    return defaults;
  }
  if (Array.isArray(formData)) {
    const defaultsArray = Array.isArray(defaults) ? defaults : [];
    const mapped = formData.map((value, idx) => {
      if (defaultsArray[idx]) {
        return mergeDefaultsWithFormData<any>(
          defaultsArray[idx],
          value,
          mergeExtraArrayDefaults,
          defaultsSupersedesUndefined,
        );
      }
      return value;
    });
    // Merge any extra defaults when mergeExtraArrayDefaults is true
    if (mergeExtraArrayDefaults && mapped.length < defaultsArray.length) {
      mapped.push(...defaultsArray.slice(mapped.length));
    }
    return mapped as unknown as T;
  }
  if (isSchemaObjectValue(formData)) {
    const acc: { [key in keyof T]: any } = Object.assign({}, defaults); // Prevent mutation of source object.
    const defaultsAsObject = isSchemaObjectValue(defaults)
      ? defaults
      : undefined;
    for (const [key, value] of Object.entries(formData)) {
      acc[key as keyof T] = mergeDefaultsWithFormData(
        defaultsAsObject?.[key],
        value,
        mergeExtraArrayDefaults,
        defaultsSupersedesUndefined
      );
    }
    return acc;
  }
  return formData;
}

export function mergeSchemaObjects<
  A extends SchemaObjectValue,
  B extends SchemaObjectValue
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

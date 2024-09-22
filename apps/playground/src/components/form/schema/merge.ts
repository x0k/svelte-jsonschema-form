import {
  ADDITIONAL_PROPERTIES_KEY,
  ALL_OF_KEY,
  ANY_OF_KEY,
  CONTAINS_KEY,
  DEFINITIONS_KEY,
  DEFS_KEY,
  DEPENDENCIES_KEY,
  ELSE_KEY,
  IF_KEY,
  NOT_KEY,
  ONE_OF_KEY,
  PATTERN_PROPERTIES_KEY,
  PROPERTIES_KEY,
  REQUIRED_KEY,
  THEN_KEY,
  type Schema,
  type SchemaDefinition,
} from "./schema";
import { isSchemaObjectValue } from "./value";

const OBJECT_KEYS = [
  DEFS_KEY,
  PROPERTIES_KEY,
  PATTERN_PROPERTIES_KEY,
  DEFINITIONS_KEY,
] as const;

const SCHEMA_KEYS = [
  ADDITIONAL_PROPERTIES_KEY,
  CONTAINS_KEY,
  IF_KEY,
  THEN_KEY,
  ELSE_KEY,
  NOT_KEY,
] as const;

const ARRAY_KEYS = [ALL_OF_KEY, ANY_OF_KEY, ONE_OF_KEY] as const;

function mergeRecords<T>(
  left: Record<string, T>,
  right: Record<string, T>,
  merge: (l: T, r: T) => T
) {
  const target = Object.assign({}, left);
  for (const [key, value] of Object.entries(right)) {
    if (!(key in left)) {
      target[key] = value;
      continue;
    }
    target[key] = merge(left[key], value);
  }
  return target;
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
  for (const key of OBJECT_KEYS) {
    if (!(key in merged)) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = mergeRecords(l, r, mergeSchemaDefinitions);
    }
  }
  if (left[DEPENDENCIES_KEY] && right[DEPENDENCIES_KEY]) {
    merged[DEPENDENCIES_KEY] = mergeRecords(
      left[DEPENDENCIES_KEY],
      right[DEPENDENCIES_KEY],
      mergeSchemaDependencies
    );
  }
  for (const key of SCHEMA_KEYS) {
    if (!(key in merged)) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = mergeSchemaDefinitions(l, r);
    }
  }
  for (const key of ARRAY_KEYS) {
    if (!(key in merged)) {
      continue;
    }
    const l = left[key];
    const r = right[key];
    if (l && r) {
      merged[key] = l.concat(r);
    }
  }
  if (left[REQUIRED_KEY] && right[REQUIRED_KEY]) {
    merged[REQUIRED_KEY] = Array.from(
      new Set(left[REQUIRED_KEY].concat(right[REQUIRED_KEY]))
    );
  }
  return merged;
}

export function mergeDefaultsWithFormData<T = any>(
  defaults?: T,
  formData?: T,
  mergeExtraArrayDefaults = false
): T | undefined {
  if (Array.isArray(formData)) {
    const defaultsArray = Array.isArray(defaults) ? defaults : [];
    const mapped = formData.map((value, idx) => {
      if (defaultsArray[idx]) {
        return mergeDefaultsWithFormData<any>(
          defaultsArray[idx],
          value,
          mergeExtraArrayDefaults
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
        mergeExtraArrayDefaults
      );
    }
    return acc;
  }
  return formData;
}

import mergeAllOf, { type Options } from "json-schema-merge-allof";

import { unique as uniqueItems } from "@/lib/array.js";
import {
  ARRAYS_OF_SUB_SCHEMAS,
  RECORDS_OF_SUB_SCHEMAS,
  SUB_SCHEMAS,
} from "@/lib/json-schema/index.js";
import {
  DEPENDENCIES_KEY,
  getDefaultFormState,
  isSchemaObjectValue,
  ITEMS_KEY,
  REQUIRED_KEY,
  type Experimental_DefaultFormStateBehavior,
  type Schema,
  type SchemaDefinition,
  type Validator,
} from "@/core/index.js";
import type { FormMerger } from "@/form/index.js";

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
  return unique ? uniqueItems(merged) : merged;
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

interface MergeSchemasOptions {
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

export type FormMergerOptions = Experimental_DefaultFormStateBehavior & {
  includeUndefinedValues?: boolean | "excludeObjectChildren";
};

export function createFormMerger(
  validator: Validator,
  rootSchema: Schema,
  options: FormMergerOptions = {}
): FormMerger {
  const merger: FormMerger = {
    mergeSchemas,
    mergeAllOf(schema) {
      return mergeAllOf(schema, { deep: false } as Options) as Schema;
    },
    mergeFormDataAndSchemaDefaults(formData, schema) {
      return getDefaultFormState(
        validator,
        merger,
        schema,
        formData,
        rootSchema,
        options.includeUndefinedValues,
        options
      );
    },
  };
  return merger;
}

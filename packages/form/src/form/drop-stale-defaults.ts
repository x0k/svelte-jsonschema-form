/**
 * Replaces values that still hold a swapped-away `dependencies` or
 * `if`/`then`/`else` branch's declared default with the newly selected branch's
 * declaration.
 *
 * The sjsf form keeps the changed path and the value it replaced, so the search
 * walks both resolved schema trees and compares the defaults each level declares.
 */

import {
  isSchemaObjectValue,
  isSchemaValueDeepEqual,
  retrieveSchema,
  type Merger,
  type Schema,
  type SchemaObjectValue,
  type SchemaValue,
  type Validator,
} from "#core/index.js";

import type { FieldPath } from "./id.js";

function isSchemaObject(value: unknown): value is Schema {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneDefault(value: SchemaValue) {
  return typeof value === "object" && value !== null
    ? structuredClone(value)
    : value;
}

function getDeclaredDefault(levelSchema: Schema, key: string, schema: Schema) {
  const declared = schema.const ?? schema.default;
  if (declared !== undefined) {
    return declared;
  }
  const levelDefault = levelSchema.default;
  return isSchemaObjectValue(levelDefault) && Object.hasOwn(levelDefault, key)
    ? levelDefault[key]
    : undefined;
}

function dropStaleDefaultsAtLevel(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaObjectValue,
  oldFormData: SchemaObjectValue,
  changedPath: FieldPath | undefined,
  level: number
): SchemaObjectValue {
  const newProperties = newSchema.properties;
  const oldProperties = oldSchema.properties;
  if (
    !isSchemaObjectValue(newProperties) ||
    !isSchemaObjectValue(oldProperties)
  ) {
    return formData;
  }

  let result = formData;
  for (const key of Object.keys(newProperties)) {
    if (!Object.hasOwn(oldProperties, key)) {
      continue;
    }
    const newRaw = newProperties[key];
    const oldRaw = oldProperties[key];
    if (!isSchemaObject(newRaw) || !isSchemaObject(oldRaw)) {
      continue;
    }
    const current = result[key];
    const oldCurrent = oldFormData[key];
    if (current === undefined || oldCurrent === undefined) {
      continue;
    }

    const newResolved = retrieveSchema(
      validator,
      merger,
      newRaw,
      rootSchema,
      current
    );
    const oldResolved = retrieveSchema(
      validator,
      merger,
      oldRaw,
      rootSchema,
      oldCurrent
    );

    const oldDefault = getDeclaredDefault(oldSchema, key, oldResolved);
    const newDefault = getDeclaredDefault(newSchema, key, newResolved);
    const isChangedKey = changedPath?.[level] === key;
    if (
      !isChangedKey &&
      oldDefault !== undefined &&
      newDefault !== undefined &&
      !isSchemaValueDeepEqual(oldDefault, newDefault) &&
      isSchemaValueDeepEqual(oldDefault, oldCurrent)
    ) {
      if (result === formData) {
        result = { ...formData };
      }
      result[key] = cloneDefault(newDefault);
      continue;
    }

    if (isSchemaObjectValue(current) && isSchemaObjectValue(oldCurrent)) {
      const next = dropStaleDefaultsAtLevel(
        validator,
        merger,
        rootSchema,
        newResolved,
        oldResolved,
        current,
        oldCurrent,
        changedPath,
        level + 1
      );
      if (next !== current) {
        if (result === formData) {
          result = { ...formData };
        }
        result[key] = next;
      }
    }
  }
  return result;
}

/**
 * Replaces values that a swapped-in `dependencies` or `if`/`then`/`else`
 * substchema declared differently, so the form does not keep the old branch's
 * default.
 */
export function dropStaleDefaults(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaValue | undefined,
  oldFormData: SchemaValue | undefined,
  changedPath?: FieldPath
): SchemaValue | undefined {
  if (
    !isSchemaObjectValue(formData) ||
    !isSchemaObjectValue(oldFormData) ||
    !isSchemaObjectValue(newSchema) ||
    !isSchemaObjectValue(oldSchema)
  ) {
    return formData;
  }
  return dropStaleDefaultsAtLevel(
    validator,
    merger,
    rootSchema,
    newSchema,
    oldSchema,
    formData,
    oldFormData,
    changedPath,
    0
  );
}

/**
 * Removes values that still hold a swapped-away `dependencies` or
 * `if`/`then`/`else` branch's declared default, so the defaults fill can write
 * the newly selected branch's default instead.
 *
 * The sjsf form keeps no change path, so the search walks both schema trees and
 * compares the values each branch declares. A level whose `oneOf`/`anyOf` options
 * describe its properties is owned by `formDataForNewOption()` and its own keys are
 * left alone; the walk still descends, since a conditional can live under one of
 * those properties.
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

function isSchemaObject(value: unknown): value is Schema {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function optionsDeclareProperties(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  level: Schema
) {
  const options = level.oneOf ?? level.anyOf;
  if (!Array.isArray(options)) {
    return false;
  }
  return options.some((option) => {
    if (!isSchemaObject(option)) {
      return false;
    }
    if (isSchemaObjectValue(option.properties)) {
      return true;
    }
    return (
      option.$ref !== undefined &&
      isSchemaObjectValue(
        retrieveSchema(validator, merger, option, rootSchema).properties
      )
    );
  });
}

function dropStaleDefaultsAtLevel(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaObjectValue,
  oldFormData: SchemaObjectValue
): SchemaObjectValue {
  const newProperties = newSchema.properties;
  const oldProperties = oldSchema.properties;
  if (
    !isSchemaObjectValue(newProperties) ||
    !isSchemaObjectValue(oldProperties)
  ) {
    return formData;
  }

  // An option switch has already picked its defaults; only the levels below it can
  // still own a conditional branch.
  const skipOwnKeys =
    optionsDeclareProperties(validator, merger, rootSchema, newSchema) ||
    (newSchema !== oldSchema &&
      optionsDeclareProperties(validator, merger, rootSchema, oldSchema));

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
    if (!skipOwnKeys && oldDefault !== undefined && newDefault !== undefined) {
      if (
        !isSchemaValueDeepEqual(oldDefault, newDefault) &&
        isSchemaValueDeepEqual(oldDefault, oldCurrent)
      ) {
        if (result === formData) {
          result = { ...formData };
        }
        delete result[key];
        continue;
      }
    }

    if (isSchemaObjectValue(current) && isSchemaObjectValue(oldCurrent)) {
      const next = dropStaleDefaultsAtLevel(
        validator,
        merger,
        rootSchema,
        newResolved,
        oldResolved,
        current,
        oldCurrent
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
 * Removes values that a swapped-in `dependencies` or `if`/`then`/`else`
 * substchema no longer declares, so the form's default fill can replace them
 * with the newly selected branch's defaults.
 */
export function dropStaleDefaults(
  validator: Validator,
  merger: Merger,
  rootSchema: Schema,
  newSchema: Schema,
  oldSchema: Schema,
  formData: SchemaValue | undefined,
  oldFormData: SchemaValue | undefined
): SchemaValue | undefined {
  if (
    newSchema === oldSchema ||
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
    oldFormData
  );
}

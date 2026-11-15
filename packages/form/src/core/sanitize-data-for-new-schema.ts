// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/sanitizeDataForNewSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { getOwn, setOwn } from "#lib/object.js";

import { isValueDeepEqual, type CoreContext } from "./context.js";
import { isSchemaDeepEqual } from "./deep-equal.js";
import { getSelectOptionValuesSafe } from "./is-select.js";
import { retrieveSchema } from "./resolve.js";
import {
  CONST_KEY,
  DEFAULT_KEY,
  type Schema,
  type SchemaArrayValue,
  type SchemaObjectValue,
  type SchemaValue,
} from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

const NO_VALUE = Symbol("no Value");
const NO_OPTIONS: SchemaValue[] = [];

/**
 * Whether two schemas' `type`s name the same types, ported from RJSF: a list
 * is compared by what it names rather than by identity or order, since
 * `['null', 'string']` allows what `['string', 'null']` does.
 */
function isSameType(oldType: Schema["type"], newType: Schema["type"]): boolean {
  if (oldType === newType) {
    return true;
  }
  if (!Array.isArray(oldType) || !Array.isArray(newType)) {
    return false;
  }
  const newTypes = new Set(newType);
  const oldTypes = new Set(oldType);
  return (
    oldTypes.size === newTypes.size &&
    oldType.every((type) => newTypes.has(type))
  );
}

/**
 * Lists the values a schema's `enum`, `const`, or constant options describe, or
 * `undefined` where it describes no closed list. Ported from RJSF's
 * `enumValuesForSchema()` for array items, where RJSF filters a whole item
 * against any value an option lists. Property replacement keeps using
 * `getSelectOptionValuesSafe()`, as SJSF reads a `oneOf`/`anyOf` option listing
 * several values as no enum-like list at all, so a field keeps its data.
 *
 * SJSF reads `oneOf` before `anyOf`, as `getSelectOptionValuesSafe()` does,
 * where RJSF's `getXxxOfKey()` reads `anyOf` first.
 */
function enumValuesForSchema(schema: Schema): SchemaValue[] | undefined {
  // An empty `enum` lists no value to check against, which is how the
  // `oneOf`/`anyOf` below read one, so it offers no constraint rather than
  // rejecting everything
  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum;
  }
  const altSchemas = schema.oneOf ?? schema.anyOf;
  if (altSchemas === undefined) {
    return undefined;
  }
  const values: SchemaValue[] = [];
  for (const altSchema of altSchemas) {
    // An option with neither a `const` nor an `enum` accepts values beyond the
    // listed ones, so there is no list to check a value by
    if (!isSchemaObject(altSchema)) {
      return undefined;
    }
    // A `const` wins over an `enum` beside it, as RJSF reads the two
    if (altSchema.const !== undefined) {
      values.push(altSchema.const);
    } else if (Array.isArray(altSchema.enum)) {
      values.push(...altSchema.enum);
    } else {
      return undefined;
    }
  }
  return values.length > 0 ? values : undefined;
}

function arrayConstRejects(
  newSchema: Schema,
  oldSchema: Schema,
  data: SchemaValue | undefined
) {
  return (
    Array.isArray(newSchema.const) &&
    !isSchemaValueDeepEqual(newSchema.const, data) &&
    !isSchemaValueDeepEqual(oldSchema.const, newSchema.const)
  );
}

function replacementForInvalidEnumValue(
  ctx: CoreContext,
  schema: Schema,
  formValue: SchemaValue | undefined
) {
  // Read through the select helper rather than `enumValuesForSchema()`: an
  // option listing several values is no enum-like list for SJSF, so a field
  // that is not a select keeps its data
  const enumValues = getSelectOptionValuesSafe(schema) ?? NO_OPTIONS;
  if (
    enumValues.length === 0 ||
    enumValues.some((value) => isValueDeepEqual(ctx, value, formValue))
  ) {
    return NO_VALUE;
  }

  const defaultValue = schema.default;
  if (
    defaultValue !== undefined &&
    enumValues.some((value) => isValueDeepEqual(ctx, value, defaultValue))
  ) {
    return defaultValue;
  }

  return enumValues.length === 1 ? enumValues[0] : undefined;
}

function sanitizeArrays(
  ctx: CoreContext,
  newSchema: Schema,
  oldSchemaItemsRaw: Schema,
  newSchemaItemsRaw: Schema,
  data: SchemaArrayValue
) {
  // Resolve refs, dependencies, if/then/else and allOf, not just a direct `$ref`, so the type check below
  // reflects an items schema whose object type is only reachable through one of those keywords (#5250)
  const oldSchemaItems = retrieveSchema(ctx, oldSchemaItemsRaw, data);
  // The old and new raw items schema are usually identical, so skip resolving a second time in that common case.
  // Neither changes per element, so compare them once rather than inside the per-element loop below.
  const sameItemsSchema = isSchemaDeepEqual(
    oldSchemaItemsRaw,
    newSchemaItemsRaw
  );
  const newSchemaItems = sameItemsSchema
    ? oldSchemaItems
    : retrieveSchema(ctx, newSchemaItemsRaw, data);
  const oldSchemaType = oldSchemaItems.type;
  const newSchemaType = newSchemaItems.type;

  // Sanitizes a container item against the items schemas resolved for its own
  // value, keeping one the new items allow as it is
  const sanitizeContainerItem = (
    newItemSchema: Schema,
    item: SchemaValue | undefined,
    isArrayItem: boolean
  ): SchemaValue | undefined => {
    const oldItemSchema = sameItemsSchema
      ? newItemSchema
      : retrieveSchema(validator, merger, oldSchemaItemsRaw, rootSchema, item);
    if (arrayConstRejects(newItemSchema, oldItemSchema, item)) {
      // An array const the old items did not declare rejects the item
      return undefined;
    }
    if (
      newItemSchema.const !== undefined &&
      isSchemaValueDeepEqual(newItemSchema.const, item)
    ) {
      // An item equal to the items const is the only one it allows, so it is
      // kept as it is rather than sanitized into one the const rejects
      return item;
    }
    const sanitized = sanitizeDataForNewSchema(
      validator,
      merger,
      rootSchema,
      newItemSchema,
      // Old items declaring no type describe no array to sanitize against, so
      // an array element is read against the new items schema on both sides
      // instead of being kept unsanitized for an old side holding no array
      isArrayItem && !oldSchemaType ? newItemSchema : oldItemSchema,
      item
    );
    // An array element the new items schema describes nothing for is kept as it
    // is, as before, rather than dropped
    return sanitized === undefined && isArrayItem ? item : sanitized;
  };

  if (!oldSchemaType || isSameType(oldSchemaType, newSchemaType)) {
    const maxItems = newSchema.maxItems ?? -1;
    // The items' type is read through `getSimpleSchemaType()`, as a field reads it,
    // so a type list that also allows `null` is sanitized as a plain container
    // is, when it holds one: a `null` it allows stays as it is. Only a declared
    // type counts, so a typeless `const` guessed as an array is not sanitized
    // against `items` it does not declare.
    const itemsType =
      newSchemaType === undefined
        ? undefined
        : getSimpleSchemaType(newSchemaItems);
    if (itemsType === "object" || itemsType === "array") {
      return data.reduce((newValue: SchemaArrayValue, item) => {
        if (maxItems >= 0 && newValue.length >= maxItems) {
          return newValue;
        }
        // Resolve refs, dependencies, if/then/else and allOf against this item's own value, so a conditional
        // nested inside `items` picks the branch that matches this element rather than the whole array (#5250).
        // Keep the raw (pre-resolution) items schema around: it must be re-resolved per element below,
        // against that element's own value, rather than the whole array.
        const oldItemSchema = retrieveSchema(ctx, oldSchemaItemsRaw, aValue);
        const newItemSchema = sameItemsSchema
          ? oldItemSchema
          : retrieveSchema(ctx, newSchemaItemsRaw, aValue);
        const itemValue = sanitizeDataForNewSchema(
          ctx,
          newItemSchema,
          oldItemSchema,
          aValue
        );
        if (
          itemValue !== undefined &&
          (maxItems < 0 || newValue.length < maxItems)
        ) {
          itemValue = sanitizeContainerItem(
            newItemSchema,
            item,
            itemsType === "array"
          );
        } else if (isContainerItem) {
          // An object item whose schema declares no `properties` has none to
          // prune, so a plain object is kept as it is (#5736)
          itemValue = isSchemaObjectValue(item) ? item : undefined;
        }
        if (itemValue !== undefined) {
          newValue.push(itemValue);
        }
        return newValue;
      }, []);
    } else {
      // Filter out items that are no longer valid in the new items schema (e.g., enum values that changed)
      const newItemEnumValues = enumValuesForSchema(newSchemaItems);
      const filteredData =
        newItemEnumValues !== undefined
          ? data.filter((item) =>
              newItemEnumValues.some((v) => isValueDeepEqual(ctx, v, item))
            )
          : data;
      // `maxItems` of 0 allows no item at all, which is how the container items path above reads it too
      return maxItems >= 0 && filteredData.length > maxItems
        ? filteredData.slice(0, maxItems)
        : filteredData;
    }
  }
  return NO_VALUE;
}

export function sanitizeDataForNewSchema(
  ctx: CoreContext,
  newSchema: Schema,
  oldSchema: Schema,
  data: SchemaValue | undefined
): SchemaValue | undefined {
  let newFormData;
  const newSchemaProperties = newSchema.properties;
  const isDataObject = isSchemaObjectValue(data);
  if (newSchemaProperties !== undefined) {
    const removeOldSchemaData: SchemaObjectValue = {};
    const oldSchemaProperties = oldSchema.properties;
    if (oldSchemaProperties !== undefined && isDataObject) {
      Object.keys(oldSchemaProperties).forEach((key) => {
        if (Object.hasOwn(data, key)) {
          setOwn(removeOldSchemaData, key, undefined);
        }
      });
    }
    const keys: string[] = Object.keys(newSchemaProperties);
    const nestedData: SchemaObjectValue = {};
    keys.forEach((key) => {
      const formValue = isDataObject ? getOwn(data, key) : undefined;
      const isNewProperty =
        oldSchemaProperties === undefined ||
        !Object.hasOwn(oldSchemaProperties, key);
      const oldKeyedSchemaDef = getOwn(oldSchemaProperties ?? {}, key);
      const oldRawKeyedSchema: Schema =
        typeof oldKeyedSchemaDef === "object" ? oldKeyedSchemaDef : {};
      const newKeyedSchemaDef = newSchemaProperties?.[key];
      const newRawKeyedSchema: Schema =
        typeof newKeyedSchemaDef === "object" ? newKeyedSchemaDef : {};
      // Resolve refs, dependencies, if/then/else and allOf so a dependency nested inside this key
      // (not just at the root schema) is taken into account when sanitizing its data (#5250)
      const oldKeyedSchema = retrieveSchema(ctx, oldRawKeyedSchema, formValue);
      // The old and new raw schema for a key are usually identical (most keys aren't touched by whatever changed),
      // so skip resolving (and re-running any oneOf/dependency validity checks) a second time in that common case.
      const newKeyedSchema = isSchemaDeepEqual(
        oldRawKeyedSchema,
        newRawKeyedSchema
      )
        ? oldKeyedSchema
        : retrieveSchema(ctx, newRawKeyedSchema, formValue);

      const oldSchemaTypeForKey = oldKeyedSchema.type;
      const newSchemaTypeForKey = newKeyedSchema.type;
      if (
        !oldSchemaTypeForKey ||
        isSameType(oldSchemaTypeForKey, newSchemaTypeForKey)
      ) {
        if (Object.hasOwn(removeOldSchemaData, key)) {
          delete removeOldSchemaData[key];
        }
        // A container is read through `getSimpleSchemaType()`, as the array items
        // below read it, so a type list that also allows `null` is sanitized
        // as a plain object or array is when it holds one, and a `null` it
        // allows stays as it is. Only a declared type counts, so a schema
        // guessed from `const` is not read as a container here.
        const containerType =
          newSchemaTypeForKey === undefined
            ? undefined
            : getSimpleSchemaType(newKeyedSchema);
        const isArrayValue =
          containerType === "array" && Array.isArray(formValue);
        const isObjectValue =
          newSchemaTypeForKey === "object" ||
          (containerType === "object" && isSchemaObjectValue(formValue));
        if (isObjectValue || isArrayValue) {
          const itemData = sanitizeDataForNewSchema(
            ctx,
            newKeyedSchema,
            isNewProperty && isArrayValue ? newKeyedSchema : oldKeyedSchema,
            formValue
          );
          if (itemData !== undefined || isArrayValue) {
            setOwn(nestedData, key, itemData);
          }
        } else {
          // `null` is a declared value, not an absent one, so only an absent
          // key yields `NO_VALUE`.
          const newOptionDefault = getOwn(
            newKeyedSchema,
            DEFAULT_KEY,
            NO_VALUE
          );
          const oldOptionDefault = getOwn(
            oldKeyedSchema,
            DEFAULT_KEY,
            NO_VALUE
          );
          if (newOptionDefault !== NO_VALUE && newOptionDefault !== formValue) {
            if (
              (isNewProperty && formValue === undefined) ||
              oldOptionDefault === formValue
            ) {
              // Initialize a newly entered property or replace an old default with the new default.
              setOwn(removeOldSchemaData, key, newOptionDefault);
            } else if (newKeyedSchema.readOnly === true) {
              setOwn(removeOldSchemaData, key, undefined);
            }
          }

          const newOptionConst = getOwn(newKeyedSchema, CONST_KEY, NO_VALUE);
          const oldOptionConst = getOwn(oldKeyedSchema, CONST_KEY, NO_VALUE);
          if (newOptionConst !== NO_VALUE && newOptionConst !== formValue) {
            setOwn(
              removeOldSchemaData,
              key,
              oldOptionConst === formValue ? newOptionConst : undefined
            );
          }

          if (isDataObject && Object.hasOwn(data, key)) {
            const enumReplacement = replacementForInvalidEnumValue(
              ctx,
              newKeyedSchema,
              formValue
            );
            if (enumReplacement !== NO_VALUE) {
              setOwn(removeOldSchemaData, key, enumReplacement);
            }
          }
        }
      }
    });

    newFormData = {
      ...(isDataObject ? data : undefined),
      ...removeOldSchemaData,
      ...nestedData,
    };
  } else if (
    oldSchema.type === "array" &&
    newSchema.type === "array" &&
    Array.isArray(data)
  ) {
    const oldSchemaItems = oldSchema.items;
    const newSchemaItems = newSchema.items;
    if (
      isSchemaObjectValue(oldSchemaItems) &&
      isSchemaObjectValue(newSchemaItems)
    ) {
      const newFormDataArray = sanitizeArrays(
        ctx,
        newSchema,
        oldSchemaItems,
        newSchemaItems,
        data
      );
      if (newFormDataArray !== NO_VALUE) {
        newFormData = newFormDataArray;
      }
    } else if (
      typeof oldSchemaItems === "boolean" &&
      typeof newSchemaItems === "boolean" &&
      oldSchemaItems === newSchemaItems
    ) {
      // If they are both booleans and have the same value just return the data as is otherwise fall-thru to undefined
      newFormData = data;
    }
    // Also probably want to deal with `prefixItems` as tuples with the latest 2020 draft
  }
  return newFormData;
}

// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/mergeObjects.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { isNil } from "@/lib/types.js";

import type { SchemaObjectValue } from "./schema.js";
import { isSchemaObjectValue } from "./value.js";

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
      ((!isNil(defaults) && isNil(formData)) ||
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

// This file contains content from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/core/src/components/Form.tsx
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { get, pick } from 'es-toolkit/compat'

import { NAME_KEY, SJSF_ADDITIONAL_PROPERTIES_FLAG, toPathSchema2, type PathSchema } from './core/path-schema.js';
import { retrieveSchema2 } from './core/resolve.js';
import type { Schema, SchemaObjectValue, SchemaValue } from './core/schema.js';
import type { Validator } from './core/validator.js';
import { isSchemaValueEmpty } from './core/value.js';
import { defaultMerger, type Merger2 } from './core/merger.js';

/**
 * @private For testing only
 */
export function getFieldNames(pathSchema: PathSchema<SchemaValue>, formData: SchemaValue | undefined): string[][] {
  const getAllPaths = (_obj: Record<string, any>, acc: string[][] = [], paths: string[][] = [[]]) => {
    Object.keys(_obj).forEach((key: string) => {
      if (typeof _obj[key] === 'object') {
        const newPaths = paths.map((path) => [...path, key]);
        // If an object is marked with additionalProperties, all its keys are valid
        if (_obj[key][SJSF_ADDITIONAL_PROPERTIES_FLAG] && _obj[key][NAME_KEY] !== '') {
          acc.push(_obj[key][NAME_KEY]);
        } else {
          getAllPaths(_obj[key], acc, newPaths);
        }
      } else if (key === NAME_KEY && _obj[key] !== '') {
        paths.forEach((path) => {
          const formValue = get(formData, path);
          // adds path to fieldNames if it points to a value
          // or an empty object/array
          if (
            typeof formValue !== 'object' ||
            isSchemaValueEmpty(formValue) ||
            (Array.isArray(formValue) && formValue.every((val) => typeof val !== 'object'))
          ) {
            acc.push(path);
          }
        });
      }
    });
    return acc;
  };
  return getAllPaths(pathSchema);
}

/**
 * @private For testing only
 */
export function getUsedFormData(formData: SchemaValue | undefined, fields: string[] | string[][]): SchemaValue | undefined {
    // For the case of a single input form
    if (fields.length === 0 && typeof formData !== 'object') {
      return formData;
    }
    // _pick has incorrect type definition, it works with string[][], because lodash/hasIn supports it
    const data = pick(formData, fields);
    if (Array.isArray(formData)) {
      return Object.keys(data).map((key: string) => (data as SchemaObjectValue)[key]);
    }
    return data as SchemaValue;
  };

/**
 * @deprecated use `omitExtraData2`
 */
export function omitExtraData(
  validator: Validator,
  schema: Schema,
  formData: SchemaValue | undefined,
  merger = defaultMerger
) {
  return omitExtraData2(validator, merger, schema, formData);
}

export function omitExtraData2(
  validator: Validator,
  merger: Merger2,
  schema: Schema,
  formData: SchemaValue | undefined
) {
  const retrievedSchema = retrieveSchema2(validator, merger, schema, schema, formData);
  const pathSchema = toPathSchema2(validator, merger, retrievedSchema, "", schema, formData);
  const fieldNames = getFieldNames(pathSchema, formData);
  return getUsedFormData(formData, fieldNames);
}

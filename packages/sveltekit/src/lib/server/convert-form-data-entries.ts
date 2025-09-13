import { fileToDataURL } from '@sjsf/form/lib/file';
import {
  getSchemaConstantValue,
  isNullableSchemaType,
  isSelect,
  pickSchemaType,
  typeOfSchema,
  type Merger,
  type Validator
} from '@sjsf/form/core';
import { DEFAULT_BOOLEAN_ENUM, type FieldValue, type Schema, type UiSchemaRoot } from '@sjsf/form';

import type { EntriesConverter, EntriesConverterOptions } from './entry.js';

export type UnknownEntryConverter = (
  key: string,
  value: string,
  options: EntriesConverterOptions<FormDataEntryValue>
) => Promise<FieldValue> | FieldValue;
export interface FormDataConverterOptions {
  validator: Validator;
  merger: Merger;
  rootSchema: Schema;
  rootUiSchema: UiSchemaRoot;
  convertUnknownEntry?: UnknownEntryConverter;
}

export function createFormDataEntriesConverter({
  validator,
  merger,
  rootSchema,
  rootUiSchema,
  convertUnknownEntry
}: FormDataConverterOptions): EntriesConverter<FormDataEntryValue> {
  return async (signal, options) => {
    const { entries, schema, uiSchema } = options;
    if (typeof schema === 'boolean') {
      return schema ? (entries[0]?.[1] as FieldValue) : undefined;
    }
    const typeOrTypes = typeOfSchema(schema);
    const type = Array.isArray(typeOrTypes) ? pickSchemaType(typeOrTypes) : typeOrTypes;
    if (entries.length === 0) {
      if (type === 'boolean') {
        return false;
      }
      return isNullableSchemaType(typeOrTypes) ? null : undefined;
    }
    const value = entries[0][1];
    if (value instanceof File) {
      if (type === 'string') {
        const format = schema.format;
        if (format !== 'data-url') {
          throw new Error(`Unexpected format "${format}" for File value, expected: "data-url"`);
        }
        return await fileToDataURL(signal, value);
      }
      if (type === 'unknown') {
        return value as FieldValue;
      }
      throw new Error(
        `Unexpected type "${type}" for 'File' value instance, expected: "string", "unknown"`
      );
    }
    if (isSelect(validator, merger, schema, rootSchema)) {
      const altSchemas = schema.oneOf ?? schema.anyOf;
      const options = Array.isArray(altSchemas)
        ? altSchemas.map((s) => (typeof s === 'boolean' ? s : getSchemaConstantValue(s)))
        : (schema.enum ?? (type === 'boolean' ? DEFAULT_BOOLEAN_ENUM : undefined));
      if (options === undefined) {
        throw new Error(`Invalid select options: ${JSON.stringify(schema)}`);
      }
      const num = Number(value);
      if (Number.isInteger(num) && num >= 0 && num < options.length) {
        return structuredClone(options[num]);
      }
      if (options.includes(value)) {
        return value;
      }
      throw new Error(`Value "${value}" does not match the schema: ${JSON.stringify(schema)}`);
    }
    if (type === 'unknown' && convertUnknownEntry) {
      return await convertUnknownEntry(entries[0][0], value, options);
    }
    switch (type) {
      case 'string':
        if (value === '') {
          return schema.default === '' ||
            uiSchema['ui:options']?.stringEmptyValue === '' ||
            rootUiSchema['ui:globalOptions']?.stringEmptyValue === ''
            ? ''
            : undefined;
        }
        return value;
      case 'boolean':
        return value === 'on';
      case 'integer':
        return parseInt(value, 10);
      case 'number':
        return parseFloat(value);
      default: {
        throw new Error(`Unexpected schema type: ${type}`);
      }
    }
  };
}

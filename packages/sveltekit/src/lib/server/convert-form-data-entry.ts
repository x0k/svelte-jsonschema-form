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

import type { EntryConverter, EntryConverterOptions } from '$lib/model.js';

export type UnknownEntryConverter = (
  options: EntryConverterOptions<FormDataEntryValue>
) => Promise<FieldValue> | FieldValue;
export interface FormDataConverterOptions {
  validator: Validator;
  merger: Merger;
  rootSchema: Schema;
  rootUiSchema: UiSchemaRoot;
  convertUnknownEntry?: UnknownEntryConverter;
}

const DEFAULT_BOOLEAN_ENUM_KEYS_SET = new Set(Object.keys(DEFAULT_BOOLEAN_ENUM));

export function createFormDataEntryConverter({
  validator,
  merger,
  rootSchema,
  rootUiSchema,
  convertUnknownEntry
}: FormDataConverterOptions): EntryConverter<FormDataEntryValue> {
  return async (signal, options) => {
    const { value, schema, uiSchema } = options;
    if (typeof schema === 'boolean') {
      return schema ? (value as FieldValue) : undefined;
    }
    const typeOrTypes = typeOfSchema(schema);
    const type = Array.isArray(typeOrTypes) ? pickSchemaType(typeOrTypes) : typeOrTypes;
    if (value === undefined) {
      if (type === 'boolean') {
        return false;
      }
      return isNullableSchemaType(typeOrTypes) ? null : undefined;
    }
    if (value instanceof File) {
      if (value.name === '' && value.size === 0) {
        return undefined;
      }
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
      return await convertUnknownEntry(options);
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
        return DEFAULT_BOOLEAN_ENUM_KEYS_SET.has(value)
          ? DEFAULT_BOOLEAN_ENUM[Number(value)]
          : value === 'on';
      case 'integer':
        return value.trim() === '' ? undefined : parseInt(value, 10);
      case 'number':
        return value.trim() === '' ? undefined : parseFloat(value);
      default: {
        throw new Error(`Unexpected schema type: ${type}`);
      }
    }
  };
}

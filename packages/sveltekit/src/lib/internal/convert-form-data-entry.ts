import { fileToDataURL } from '@sjsf/form/lib/file';
import {
  getSchemaConstantValue,
  isNullableSchemaType,
  isSchemaValueDeepEqual,
  isSelect,
  pickSchemaType,
  typeOfSchema,
  type Merger,
  type SchemaValue,
  type Validator
} from '@sjsf/form/core';
import { DEFAULT_BOOLEAN_ENUM, type FieldValue, type Schema, type UiSchemaRoot } from '@sjsf/form';

import type { EntryConverter, EntryConverterOptions, EnumItemDecoder } from '../model.js';

export type UnknownEntryConverter = (
  options: EntryConverterOptions<FormDataEntryValue>
) => Promise<FieldValue> | FieldValue;
export interface FormDataConverterOptions {
  validator: Validator;
  merger: Merger;
  rootSchema: Schema;
  rootUiSchema: UiSchemaRoot;
  enumItemDecoder: EnumItemDecoder;
  convertUnknownEntry?: UnknownEntryConverter;
}

type JSONParseResult<T, E> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: E;
    };

function parseJson<T, E>(jsonStr: string): JSONParseResult<T, E> {
  try {
    return {
      ok: true,
      value: JSON.parse(jsonStr)
    };
  } catch (error) {
    return {
      ok: false,
      error: error as E
    };
  }
}

export function createEnumItemDecoder(decodeOptionIndex: (value: string) => number | undefined) {
  return (options: SchemaValue[], value: string) => {
    const index = decodeOptionIndex(value);
    if (index !== undefined && index >= 0 && index < options.length) {
      return structuredClone(options[index]);
    }
    if (options.includes(value)) {
      return value;
    }
    const parsed = parseJson<SchemaValue, unknown>(value);
    if (parsed.ok && options.some((o) => isSchemaValueDeepEqual(o, parsed.value))) {
      return parsed.value;
    }
    return undefined;
  };
}

export function createFormDataEntryConverter({
  validator,
  merger,
  rootSchema,
  rootUiSchema,
  enumItemDecoder,
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
      const v = enumItemDecoder(options, value)
      if (v === undefined) {
        throw new Error(`Value "${value}" does not match the schema: ${JSON.stringify(schema)}`);
      }
      return v
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
        return enumItemDecoder(DEFAULT_BOOLEAN_ENUM, value) ?? value === 'on';
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

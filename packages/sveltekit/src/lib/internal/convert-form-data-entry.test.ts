import { beforeEach, describe, expect, it } from 'vitest';
import type { RPath, Schema } from '@sjsf/form/core';
import { createMerger } from '@sjsf/form/mergers/modern';
import { createFormValidator } from '@sjsf/ajv8-validator';

import { decodeOptionIndex } from '../id-builder.js';
import {
  createEnumItemDecoder,
  createFormDataEntryConverter,
  type FormDataConverterOptions
} from './convert-form-data-entry.js';

const defaultOptions: FormDataConverterOptions = {
  validator: createFormValidator(),
  merger: createMerger(),
  rootSchema: {},
  rootUiSchema: {},
  enumItemDecoder: createEnumItemDecoder(decodeOptionIndex)
};

const convert = createFormDataEntryConverter(defaultOptions);

describe('convertFormDataEntries', async () => {
  let c: AbortController;

  beforeEach(() => {
    c = new AbortController();
  });

  it('Should return null for empty nullable schema', async () => {
    expect(
      await convert(c.signal, {
        schema: {
          type: ['string', 'null']
        },
        uiSchema: {},
        path: [],
        value: undefined
      })
    ).toBeNull();
  });
  it('Should convert boolean', async () => {
    const schema: Schema = { title: 'A boolean', type: 'boolean', default: false };
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path: ['fixedNoToolbar', 1], value: 'on' })
    ).resolves.toEqual(true);
  });
  it('Should convert number', async () => {
    const schema: Schema = { title: 'A number', type: 'number', default: 42 };
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path: ['fixedNoToolbar', 0], value: '42' })
    ).resolves.toEqual(42);
  });
  it('Should convert enum value', async () => {
    const schema: Schema = {
      type: 'string',
      enum: ['foo', 'bar', 'baz']
    };
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path: [], value: 'bar' })
    ).resolves.toEqual('bar');
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path: [], value: 'gas' })
    ).rejects.toThrow(/does not match the schema/);
  });
  it('Should return correct value for enum with id mapper', async () => {
    const schema: Schema = {
      type: 'string',
      enum: ['1', '2', '3']
    };
    const path: RPath = [];
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path, value: 'root::0' })
    ).resolves.toEqual('1');
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path, value: 'root::3' })
    ).rejects.toThrow(/does not match the schema/);
  });
  it('Should return correct value from anyOf', async () => {
    const schema: Schema = {
      title: 'Color',
      type: 'string',
      anyOf: [
        {
          type: 'string',
          enum: ['#ff0000'],
          title: 'Red'
        },
        {
          type: 'string',
          enum: ['#00ff00'],
          title: 'Green'
        },
        {
          type: 'string',
          enum: ['#0000ff'],
          title: 'Blue'
        }
      ]
    };
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path: ['currentColor'], value: 'root::1' })
    ).resolves.toEqual('#00ff00');
  });
  it('Should return correct value from oneOf', async () => {
    const schema: Schema = {
      title: 'Toggle',
      type: 'boolean',
      oneOf: [
        { title: 'Enable', const: true },
        { title: 'Disable', const: false }
      ]
    };
    await expect(
      convert(c.signal, { schema, uiSchema: {}, path: ['toggleMask'], value: 'root::0' })
    ).resolves.toEqual(true);
  });
});

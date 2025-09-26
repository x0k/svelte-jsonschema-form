import { beforeEach, describe, expect, it } from 'vitest';
import type { Schema } from '@sjsf/form/core';
import { createMerger } from '@sjsf/form/mergers/modern';
import { createFormIdBuilder } from '@sjsf/form/id-builders/legacy';
import { createFormValidator } from '@sjsf/ajv8-validator';

import {
  createFormDataEntriesConverter,
  type FormDataConverterOptions
} from './convert-form-data-entries.js';
import type { Entries } from './entry.js';
const uiSchema = {};
const idBuilder = createFormIdBuilder();
const defaultOptions: FormDataConverterOptions = {
  validator: createFormValidator({ uiSchema, idBuilder }),
  merger: createMerger(),
  rootSchema: {},
  rootUiSchema: uiSchema
};

const convert = createFormDataEntriesConverter(defaultOptions);

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
        entries: []
      })
    ).toBeNull();
  });
  it('Should convert boolean', async () => {
    const schema: Schema = { title: 'A boolean', type: 'boolean', default: false };
    const entries: Entries<string> = [['root.fixedNoToolbar.1', 'on']];
    await expect(convert(c.signal, { schema, uiSchema: {}, entries })).resolves.toEqual(true);
  });
  it('Should convert number', async () => {
    const schema: Schema = { title: 'A number', type: 'number', default: 42 };
    const entries: Entries<string> = [['root.fixedNoToolbar.0', '42']];
    await expect(convert(c.signal, { schema, uiSchema: {}, entries })).resolves.toEqual(42);
  });
  it('Should convert enum value', async () => {
    const schema: Schema = {
      type: 'string',
      enum: ['foo', 'bar', 'baz']
    };
    const entries: Entries<string> = [['root', 'bar']];
    await expect(convert(c.signal, { schema, uiSchema: {}, entries })).resolves.toEqual('bar');
  });
  it('Should return correct value from enum of string numbers', async () => {
    const schema: Schema = {
      type: 'string',
      enum: ['1', '2', '3']
    };
    // First, the value is treated as an index
    await expect(
      convert(c.signal, { schema, uiSchema: {}, entries: [['root', '0']] })
    ).resolves.toEqual('1');
    // Then we check if there is a value in the enumeration
    await expect(
      convert(c.signal, { schema, uiSchema: {}, entries: [['root', '3']] })
    ).resolves.toEqual('3');
    // If nothing fits, it's an error
    await expect(
      convert(c.signal, { schema, uiSchema: {}, entries: [['root', '4']] })
    ).rejects.toThrow();
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
    const entries: Entries<string> = [['root.currentColor', '1']];
    await expect(convert(c.signal, { schema, uiSchema: {}, entries })).resolves.toEqual('#00ff00');
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
    const entries: Entries<string> = [['root.toggleMask', '0']];
    await expect(convert(c.signal, { schema, uiSchema: {}, entries })).resolves.toEqual(true);
  });
  it('Should return correct value from enum', async () => {
    const schema: Schema = { type: 'string', enum: ['foo', 'bar', 'fuzz', 'qux'] };
    const entries: Entries<string> = [['root.multipleChoicesList', '1']];
    await expect(convert(c.signal, { schema, uiSchema: {}, entries })).resolves.toEqual('bar');
  });
});

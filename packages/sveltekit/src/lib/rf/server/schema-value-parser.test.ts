import { describe, beforeEach, expect, it } from 'vitest';
import type { Schema } from '@sjsf/form';
import { createMerger } from '@sjsf/form/mergers/modern';
import { createFormValidator } from '@sjsf/ajv8-validator';

import { createFormDataEntryConverter } from '$lib/server/convert-form-data-entry.js';

import {
  parseSchemaValue,
  type Input,
  type SchemaValueParserOptions
} from './schema-value-parser.js';

const opts = ({
  input,
  schema = {},
  uiSchema = {},
  validator = createFormValidator(),
  merger = createMerger(),
  convertEntry = createFormDataEntryConverter({
    merger,
    validator,
    rootSchema: schema,
    rootUiSchema: uiSchema
  })
}: Partial<
  SchemaValueParserOptions<FormDataEntryValue>
> = {}): SchemaValueParserOptions<FormDataEntryValue> => ({
  input,
  schema,
  uiSchema,
  validator,
  merger,
  convertEntry
});

describe('parseSchemaValue', async () => {
  let c: AbortController;

  beforeEach(() => {
    c = new AbortController();
  });

  it('Should parse empty form', async () => {
    await expect(parseSchemaValue(c.signal, opts())).resolves.toBeUndefined();
  });

  it('Should revive empty array', async () => {
    const schema: Schema = {
      title: 'Locations Checkboxes',
      type: 'array',
      uniqueItems: true,
      items: {
        enum: ['foo', 'bar', 'baz']
      }
    };
    await expect(parseSchemaValue(c.signal, opts({ schema }))).resolves.toEqual([]);
  });

  it('Should parse root value', async () => {
    await expect(
      parseSchemaValue(
        c.signal,
        opts({
          schema: { type: 'string' },
          input: 'value'
        })
      )
    ).resolves.toBe('value');
  });

  it('Should parse simple schema', async () => {
    const schema: Schema = {
      title: 'A registration form',
      description: 'A simple form example.',
      type: 'object',
      required: ['firstName', 'lastName'],
      properties: {
        firstName: {
          type: 'string',
          title: 'First name',
          default: 'Chuck'
        },
        lastName: {
          type: 'string',
          title: 'Last name'
        },
        age: {
          type: 'integer',
          title: 'Age'
        },
        bio: {
          type: 'string',
          title: 'Bio'
        },
        password: {
          type: 'string',
          title: 'Password',
          minLength: 3
        },
        telephone: {
          type: 'string',
          title: 'Telephone',
          minLength: 10
        }
      }
    };
    const input: Input<FormDataEntryValue> = {
      firstName: 'Chuck',
      lastName: 'Norris',
      age: '75',
      bio: 'Roundhouse kicking asses since 1940',
      password: 'noneed',
      telephone: '1-800-KICKASS'
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      firstName: 'Chuck',
      lastName: 'Norris',
      age: 75,
      bio: 'Roundhouse kicking asses since 1940',
      password: 'noneed',
      telephone: '1-800-KICKASS'
    });
  });
});

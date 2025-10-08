import { describe, beforeEach, expect, it } from 'vitest';
import type { Schema } from '@sjsf/form';
import { createMerger } from '@sjsf/form/mergers/modern';
import { createFormValidator } from '@sjsf/ajv8-validator';

import { createFormDataEntryConverter } from '$lib/server/convert-form-data-entry.js';

import { DEFAULT_PSEUDO_SEPARATOR } from '../id-builder/index.js'

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
  }),
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR
}: Partial<
  SchemaValueParserOptions<FormDataEntryValue>
> = {}): SchemaValueParserOptions<FormDataEntryValue> => ({
  input,
  schema,
  uiSchema,
  validator,
  merger,
  convertEntry,
  pseudoSeparator
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

  it('Should parse nested schema', async () => {
    const schema: Schema = {
      title: 'A list of tasks',
      type: 'object',
      required: ['title'],
      properties: {
        title: {
          type: 'string',
          title: 'Task list title'
        },
        tasks: {
          type: 'array',
          title: 'Tasks',
          items: {
            type: 'object',
            required: ['title'],
            properties: {
              title: {
                type: 'string',
                title: 'Title',
                description: 'A sample title'
              },
              details: {
                type: 'string',
                title: 'Task details',
                description: 'Enter the task details'
              },
              done: {
                type: 'boolean',
                title: 'Done?',
                default: false
              }
            }
          }
        }
      }
    };
    const input: Input<FormDataEntryValue> = {
      title: 'My current tasks',
      tasks: [
        {
          title: 'My first task',
          details:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          done: 'on'
        },
        {
          title: 'My second task',
          details:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
        }
      ]
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      tasks: [
        {
          done: true,
          title: 'My first task',
          details:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          done: false,
          title: 'My second task',
          details:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
        }
      ],
      title: 'My current tasks'
    });
  });

  it.only('Should parse schema with `additionalProperties`', async () => {
    const schema: Schema = {
      title: 'A customizable registration form',
      description: 'A simple form with additional properties example.',
      type: 'object',
      required: ['firstName', 'lastName'],
      additionalProperties: {
        type: 'string'
      },
      properties: {
        firstName: {
          type: 'string',
          title: 'First name'
        },
        lastName: {
          type: 'string',
          title: 'Last name'
        }
      }
    };
    const input: Input<FormDataEntryValue> = {
      firstName: 'Chuck',
      lastName: 'Norris',
      assKickCountX21mX21mkeyX219input: 'assKickCountChanged',
      assKickCount: 'infinity',
      newX21akeyX21mX21mkeyX219input: 'new.keyChanged',
      newX21akey: 'foo'
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      firstName: 'Chuck',
      lastName: 'Norris',
      assKickCountChanged: 'infinity',
      'new.keyChanged': 'foo'
    });
  });
});

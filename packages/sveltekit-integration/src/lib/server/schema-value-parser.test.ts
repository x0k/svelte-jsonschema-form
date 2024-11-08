import { describe, expect, it } from 'vitest';
import type { Schema } from '@sjsf/form';

import {
  parseSchemaValue,
  type Entries,
  type SchemaValueParserOptions
} from './schema-value-parser';

const defaultOptions: SchemaValueParserOptions = {
  schema: {},
  entries: [],
  idPrefix: 'root',
  idSeparator: '.',
  idPseudoSeparator: '::',
  convertValue: (_, v) => v[0][1]
};

describe('parseSchemaValue', () => {
  it('Should parse empty entries', () => {
    expect(parseSchemaValue(defaultOptions)).toBeUndefined();
  });
  it('Should parse root value', () => {
    expect(
      parseSchemaValue({
        ...defaultOptions,
        entries: [['root', 'value']]
      })
    ).toBe('value');
  });
  it('Should parse simple schema', () => {
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
    const entries: Entries<string> = [
      ['root.firstName', 'Chuck'],
      ['root.lastName', 'Norris'],
      ['root.age', '75'],
      ['root.bio', 'Roundhouse kicking asses since 1940'],
      ['root.password', 'noneed'],
      ['root.telephone', '1-800-KICKASS']
    ];
    expect(parseSchemaValue({ ...defaultOptions, schema, entries })).toEqual({
      firstName: 'Chuck',
      lastName: 'Norris',
      age: '75',
      bio: 'Roundhouse kicking asses since 1940',
      password: 'noneed',
      telephone: '1-800-KICKASS'
    });
  });
  it('Should parse nested schema', () => {
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
    const entries: Entries<string> = [
      ['root.title', 'My current tasks'],
      ['root.tasks.0.title', 'My first task'],
      [
        'root.tasks.0.details',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      ],
      ['root.tasks.0.done', 'on'],
      ['root.tasks.1.title', 'My second task'],
      [
        'root.tasks.1.details',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
      ]
    ];
    expect(parseSchemaValue({ ...defaultOptions, schema, entries })).toEqual({
      tasks: [
        {
          done: "on",
          title: 'My first task',
          details:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          done: undefined,
          title: 'My second task',
          details:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
        }
      ],
      title: 'My current tasks'
    });
  });
});

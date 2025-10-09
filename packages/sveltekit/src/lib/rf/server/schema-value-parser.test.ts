import { describe, beforeEach, expect, it } from 'vitest';
import { DEFAULT_ID_PREFIX, SJSF_ID_PREFIX, type Schema } from '@sjsf/form';
import { createMerger } from '@sjsf/form/mergers/modern';
import { createFormValidator } from '@sjsf/ajv8-validator';

import { createFormDataEntryConverter } from '$lib/server/convert-form-data-entry.js';

import {
  parseSchemaValue,
  type Input,
  type SchemaValueParserOptions
} from './schema-value-parser.js';
import { DEFAULT_PSEUDO_PREFIX } from '../id-builder/id-builder.js';

const opts = ({
  idPrefix = DEFAULT_ID_PREFIX,
  pseudoPrefix = DEFAULT_PSEUDO_PREFIX,
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
  input: { [SJSF_ID_PREFIX]: idPrefix, ...input },
  schema,
  uiSchema,
  validator,
  merger,
  convertEntry,
  idPrefix,
  pseudoPrefix
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
          input: { [DEFAULT_ID_PREFIX]: 'value' }
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
      [DEFAULT_ID_PREFIX]: {
        firstName: 'Chuck',
        lastName: 'Norris',
        age: '75',
        bio: 'Roundhouse kicking asses since 1940',
        password: 'noneed',
        telephone: '1-800-KICKASS'
      }
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
      [DEFAULT_ID_PREFIX]: {
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
      }
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

  it('Should parse schema with `additionalProperties`', async () => {
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
      [DEFAULT_ID_PREFIX]: {
        firstName: 'Chuck',
        lastName: 'Norris',
        assKickCount: 'infinity',
        newX21akey: 'foo'
      },
      X21mX21mkeyX219input: {
        [DEFAULT_ID_PREFIX]: {
          assKickCount: { X21mX21m: 'assKickCountChanged' },
          newX21akey: { X21mX21m: 'new.keyChanged' }
        }
      }
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      firstName: 'Chuck',
      lastName: 'Norris',
      assKickCountChanged: 'infinity',
      'new.keyChanged': 'foo'
    });
  });

  it('Should parse schema with `additionalProperties` 2', async () => {
    const schema: Schema = {
      type: 'array',
      items: [
        { type: 'string' },
        {
          type: 'object',
          additionalProperties: {
            type: 'string'
          }
        },
        { type: 'number' }
      ]
    };
    const input: Input<FormDataEntryValue> = {
      [DEFAULT_ID_PREFIX]: [
        'str',
        { AdditionalX1wproperty: '123', AdditionalX1wpropertyX2191: '456' },
        '789'
      ],
      X21mX21mkeyX219input: {
        [DEFAULT_ID_PREFIX]: [
          undefined,
          {
            AdditionalX1wproperty: { X21mX21m: 'Additional property changed' },
            AdditionalX1wpropertyX2191: { X21mX21m: 'Additional property-1 changed' }
          }
        ]
      }
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual([
      'str',
      {
        'Additional property changed': '123',
        'Additional property-1 changed': '456'
      },
      789
    ]);
  });

  it('Should resolve references', async () => {
    const schema: Schema = {
      definitions: {
        address: {
          type: 'object',
          properties: {
            street_address: {
              type: 'string'
            },
            city: {
              type: 'string'
            },
            state: {
              type: 'string'
            }
          },
          required: ['street_address', 'city', 'state']
        },
        node: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            children: {
              type: 'array',
              items: {
                $ref: '#/definitions/node'
              }
            }
          }
        }
      },
      type: 'object',
      properties: {
        billing_address: {
          title: 'Billing address',
          $ref: '#/definitions/address'
        },
        shipping_address: {
          title: 'Shipping address',
          $ref: '#/definitions/address'
        },
        tree: {
          title: 'Recursive references',
          $ref: '#/definitions/node'
        }
      }
    };
    const input: Input<FormDataEntryValue> = {
      [DEFAULT_ID_PREFIX]: {
        billing_address: { street_address: '21, Jump Street', city: 'Babel', state: 'Neverland' },
        shipping_address: { street_address: '221B, Baker Street', city: 'London', state: 'N/A' },
        tree: {
          name: 'root',
          children: [{ name: 'leaf', children: [{ name: 'bar' }] }, { name: 'foo' }]
        }
      }
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      tree: {
        children: [
          {
            children: [
              {
                children: [],
                name: 'bar'
              }
            ],
            name: 'leaf'
          },
          {
            children: [],
            name: 'foo'
          }
        ],
        name: 'root'
      },
      billing_address: {
        street_address: '21, Jump Street',
        city: 'Babel',
        state: 'Neverland'
      },
      shipping_address: {
        street_address: '221B, Baker Street',
        city: 'London',
        state: 'N/A'
      }
    });
  });

  it('Should parse schema with oneOf (select)', async () => {
    const schema: Schema = {
      definitions: {
        Color: {
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
        },
        Toggle: {
          title: 'Toggle',
          type: 'boolean',
          oneOf: [
            {
              title: 'Enable',
              const: true
            },
            {
              title: 'Disable',
              const: false
            }
          ]
        }
      },
      title: 'Image editor',
      type: 'object',
      required: ['currentColor', 'colorMask', 'blendMode'],
      properties: {
        currentColor: {
          $ref: '#/definitions/Color',
          title: 'Brush color'
        },
        colorMask: {
          type: 'array',
          uniqueItems: true,
          items: {
            $ref: '#/definitions/Color'
          },
          title: 'Color mask'
        },
        toggleMask: {
          title: 'Apply color mask',
          $ref: '#/definitions/Toggle'
        },
        colorPalette: {
          type: 'array',
          title: 'Color palette',
          items: {
            $ref: '#/definitions/Color'
          }
        },
        blendMode: {
          title: 'Blend mode',
          type: 'string',
          oneOf: [
            {
              const: 'screen',
              title: 'Screen'
            },
            {
              const: 'multiply',
              title: 'Multiply'
            },
            {
              const: 'overlay',
              title: 'Overlay'
            }
          ]
        }
      }
    };
    const input: Input<FormDataEntryValue> = {
      [DEFAULT_ID_PREFIX]: {
        currentColor: '1',
        colorMask: ['2'],
        toggleMask: '0',
        colorPalette: ['0'],
        blendMode: '0'
      }
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      colorMask: ['#0000ff'],
      toggleMask: true,
      colorPalette: ['#ff0000'],
      blendMode: 'screen',
      currentColor: '#00ff00'
    });
  });

  it('Should parse schema with oneOf', async () => {
    const schema: Schema = {
      oneOf: [{ type: 'string' }, { type: 'number' }]
    };
    const input: Input<FormDataEntryValue> = {
      X21mX21moneof: { [DEFAULT_ID_PREFIX]: { X21mX21m: '1' } },
      [DEFAULT_ID_PREFIX]: '123'
    };
    await expect(
      parseSchemaValue(c.signal, opts({ schema, input, idPrefix: 'root' }))
    ).resolves.toEqual(123);
  });

  it('Should parse schema with oneOf 2', async () => {
    const schema: Schema = {
      type: 'object',
      oneOf: [
        {
          properties: {
            ipsum: {
              type: 'string'
            }
          },
          required: ['ipsum']
        },
        {
          properties: {
            ipsum: {
              type: 'number'
            }
          },
          required: ['ipsum']
        }
      ]
    };
    const input: Input<FormDataEntryValue> = {
      X21mX21moneof: { [DEFAULT_ID_PREFIX]: { X21mX21m: '1' } },
      [DEFAULT_ID_PREFIX]: { ipsum: '123' }
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      ipsum: 123
    });
  });

  it('Should parse schema with anyOf', async () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        age: {
          type: 'integer',
          title: 'Age'
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            anyOf: [
              {
                properties: {
                  foo: {
                    type: 'string'
                  }
                }
              },
              {
                properties: {
                  bar: {
                    type: 'string'
                  }
                }
              }
            ]
          }
        }
      },
      anyOf: [
        {
          title: 'First method of identification',
          properties: {
            firstName: {
              type: 'string',
              title: 'First name',
              default: 'Chuck'
            },
            lastName: {
              type: 'string',
              title: 'Last name'
            }
          }
        },
        {
          title: 'Second method of identification',
          properties: {
            idCode: {
              type: 'string',
              title: 'ID code'
            }
          }
        }
      ]
    };
    const input: Input<FormDataEntryValue> = {
      [DEFAULT_ID_PREFIX]: {
        age: '123',
        items: [{ bar: 'bar' }, { foo: 'foo' }],
        firstName: 'Chuck',
        lastName: ''
      },
      X21mX21manyof: {
        [DEFAULT_ID_PREFIX]: { items: [{ X21mX21m: '1' }, { X21mX21m: '0' }], X21mX21m: '0' }
      }
    };
    await expect(parseSchemaValue(c.signal, opts({ schema, input }))).resolves.toEqual({
      firstName: 'Chuck',
      items: [
        {
          bar: 'bar'
        },
        {
          foo: 'foo'
        }
      ],
      age: 123
    });
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import type { Schema } from '@sjsf/form';
import { createMerger } from '@sjsf/form/mergers/modern';
import { createFormValidator } from '@sjsf/ajv8-validator';

import type { Entries } from './entry.js';
import { parseSchemaValue, type SchemaValueParserOptions } from './schema-value-parser.js';
import { createFormDataEntriesConverter } from './convert-form-data-entries.js';

const opts = ({
  schema = {},
  entries = [],
  uiSchema = {},
  idPrefix = 'root',
  idSeparator = '.',
  idPseudoSeparator = '::',
  validator = createFormValidator(),
  merger = createMerger(),
  convertEntries = createFormDataEntriesConverter({
    merger,
    validator,
    rootSchema: schema,
    rootUiSchema: uiSchema
  })
}: Partial<
  SchemaValueParserOptions<FormDataEntryValue>
> = {}): SchemaValueParserOptions<FormDataEntryValue> => ({
  schema,
  uiSchema,
  entries,
  idPrefix,
  idSeparator,
  idPseudoSeparator,
  validator,
  merger,
  convertEntries
});

describe('parseSchemaValue', async () => {
  let c: AbortController;

  beforeEach(() => {
    c = new AbortController();
  });

  it('Should parse empty entries', () => {
    expect(parseSchemaValue(c.signal, opts())).toBeUndefined();
  });
  it('Should parse root value', async () => {
    await expect(
      parseSchemaValue(
        c.signal,
        opts({
          schema: { type: 'string' },
          entries: [['root', 'value']]
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
    const entries: Entries<string> = [
      ['root.firstName', 'Chuck'],
      ['root.lastName', 'Norris'],
      ['root.age', '75'],
      ['root.bio', 'Roundhouse kicking asses since 1940'],
      ['root.password', 'noneed'],
      ['root.telephone', '1-800-KICKASS']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
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
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
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
    const entries: Entries<string> = [
      ['root.firstName', 'Chuck'],
      ['root.lastName', 'Norris'],
      ['root.assKickCount::key-input', 'assKickCountChanged'],
      ['root.assKickCount', 'infinity'],
      ['root.new.key::key-input', 'new.keyChanged'],
      ['root.new.key', 'foo']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
      firstName: 'Chuck',
      lastName: 'Norris',
      assKickCountChanged: 'infinity',
      'new.keyChanged': 'foo'
    });
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
    const entries: Entries<string> = [
      ['root.shipping_address.street_address', '221B, Baker Street'],
      ['root.shipping_address.city', 'London'],
      ['root.shipping_address.state', 'N/A'],
      ['root.billing_address.street_address', '21, Jump Street'],
      ['root.billing_address.city', 'Babel'],
      ['root.billing_address.state', 'Neverland'],
      ['root.tree.name', 'root'],
      ['root.tree.children.0.name', 'leaf'],
      ['root.tree.children.0.children.0.name', 'bar'],
      ['root.tree.children.1.name', 'foo']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
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
    const entries: Entries<string> = [
      ['root.currentColor', '1'],
      ['root.colorMask', '2'],
      ['root.toggleMask', '0'],
      ['root.colorPalette.0', '0'],
      ['root.blendMode', '0']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
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
    const entries: Entries<string> = [
      ['root::oneof', '1'],
      ['root', '123']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual(123);
  });
  it('Sould parse schema with oneOf 2', async () => {
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
    const entries: Entries<string> = [
      ['root::oneof', '1'],
      ['root.ipsum', '123']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
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
    const entries: Entries<string> = [
      ['root.age', '123'],
      ['root.items.0::anyof', '1'],
      ['root.items.0.bar', 'bar'],
      ['root.items.1::anyof', '0'],
      ['root.items.1.foo', 'foo'],
      ['root::anyof', '0'],
      ['root.firstName', 'Chuck'],
      ['root.lastName', '']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
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
  it('Should parse schema with allOf', async () => {
    const schema: Schema = {
      type: 'object',
      allOf: [
        {
          properties: {
            lorem: {
              type: ['string', 'boolean'],
              default: true
            }
          }
        },
        {
          properties: {
            lorem: {
              type: 'boolean'
            },
            ipsum: {
              type: 'string'
            }
          }
        }
      ]
    };
    const entries: Entries<string> = [
      ['root.lorem', 'on'],
      ['root.ipsum', 'foo']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
      lorem: 'on',
      ipsum: 'foo'
    });
  });
  it('Should parse schema with fixed arrays and additional items', async () => {
    const schema: Schema = {
      definitions: {
        Thing: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              default: 'Default name'
            }
          }
        }
      },
      type: 'object',
      properties: {
        listOfStrings: {
          type: 'array',
          title: 'A list of strings',
          items: {
            type: 'string',
            default: 'bazinga'
          }
        },
        multipleChoicesList: {
          type: 'array',
          title: 'A multiple choices list',
          items: {
            type: 'string',
            enum: ['foo', 'bar', 'fuzz', 'qux']
          },
          uniqueItems: true
        },
        fixedItemsList: {
          type: 'array',
          title: 'A list of fixed items',
          items: [
            {
              title: 'A string value',
              type: 'string',
              default: 'lorem ipsum'
            },
            {
              title: 'a boolean value',
              type: 'boolean'
            }
          ],
          additionalItems: {
            title: 'Additional item',
            type: 'number'
          }
        },
        minItemsList: {
          type: 'array',
          title: 'A list with a minimal number of items',
          minItems: 3,
          items: {
            $ref: '#/definitions/Thing'
          }
        },
        defaultsAndMinItems: {
          type: 'array',
          title: 'List and item level defaults',
          minItems: 5,
          default: ['carp', 'trout', 'bream'],
          items: {
            type: 'string',
            default: 'unidentified'
          }
        },
        nestedList: {
          type: 'array',
          title: 'Nested list',
          items: {
            type: 'array',
            title: 'Inner list',
            items: {
              type: 'string',
              default: 'lorem ipsum'
            }
          }
        },
        unorderable: {
          title: 'Unorderable items',
          type: 'array',
          items: {
            type: 'string',
            default: 'lorem ipsum'
          }
        },
        copyable: {
          title: 'Copyable items',
          type: 'array',
          items: {
            type: 'string',
            default: 'lorem ipsum'
          }
        },
        unremovable: {
          title: 'Unremovable items',
          type: 'array',
          items: {
            type: 'string',
            default: 'lorem ipsum'
          }
        },
        noToolbar: {
          title: 'No add, remove and order buttons',
          type: 'array',
          items: {
            type: 'string',
            default: 'lorem ipsum'
          }
        },
        fixedNoToolbar: {
          title: 'Fixed array without buttons',
          type: 'array',
          items: [
            {
              title: 'A number',
              type: 'number',
              default: 42
            },
            {
              title: 'A boolean',
              type: 'boolean',
              default: false
            }
          ],
          additionalItems: {
            title: 'A string',
            type: 'string',
            default: 'lorem ipsum'
          }
        }
      }
    };
    const entries: Entries<string> = [
      ['root.listOfStrings.0', 'foo'],
      ['root.listOfStrings.1', 'bar'],
      ['root.multipleChoicesList', '0'],
      ['root.multipleChoicesList', '1'],
      ['root.fixedItemsList.0', 'Some text'],
      ['root.fixedItemsList.1', '0'],
      ['root.fixedItemsList.2', '123'],
      ['root.minItemsList.0.name', 'Default name'],
      ['root.minItemsList.1.name', 'Default name'],
      ['root.minItemsList.2.name', 'Default name'],
      ['root.defaultsAndMinItems.0', 'carp'],
      ['root.defaultsAndMinItems.1', 'trout'],
      ['root.defaultsAndMinItems.2', 'bream'],
      ['root.defaultsAndMinItems.3', 'unidentified'],
      ['root.defaultsAndMinItems.4', 'unidentified'],
      ['root.nestedList.0.0', 'lorem'],
      ['root.nestedList.0.1', 'ipsum'],
      ['root.nestedList.1.0', 'dolor'],
      ['root.unorderable.0', 'one'],
      ['root.unorderable.1', 'two'],
      ['root.copyable.0', 'one'],
      ['root.copyable.1', 'two'],
      ['root.unremovable.0', 'one'],
      ['root.unremovable.1', 'two'],
      ['root.noToolbar.0', 'one'],
      ['root.noToolbar.1', 'two'],
      ['root.fixedNoToolbar.0', '42'],
      ['root.fixedNoToolbar.1', 'on'],
      ['root.fixedNoToolbar.2', 'additional item one'],
      ['root.fixedNoToolbar.3', 'additional item two']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
      listOfStrings: ['foo', 'bar'],
      multipleChoicesList: ['foo', 'bar'],
      fixedItemsList: ['Some text', true, 123],
      minItemsList: [
        {
          name: 'Default name'
        },
        {
          name: 'Default name'
        },
        {
          name: 'Default name'
        }
      ],
      defaultsAndMinItems: ['carp', 'trout', 'bream', 'unidentified', 'unidentified'],
      nestedList: [['lorem', 'ipsum'], ['dolor']],
      unorderable: ['one', 'two'],
      copyable: ['one', 'two'],
      unremovable: ['one', 'two'],
      noToolbar: ['one', 'two'],
      fixedNoToolbar: [42, true, 'additional item one', 'additional item two']
    });
  });
  it('Should parse schema with dependencies', async () => {
    const schema: Schema = {
      title: 'Schema dependencies',
      description: 'These samples are best viewed without live validation.',
      type: 'object',
      properties: {
        simple: {
          title: 'Simple',
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            credit_card: {
              type: 'number'
            }
          },
          required: ['name'],
          dependencies: {
            credit_card: {
              properties: {
                billing_address: {
                  type: 'string'
                }
              },
              required: ['billing_address']
            }
          }
        },
        conditional: {
          title: 'Conditional',
          $ref: '#/definitions/person'
        },
        arrayOfConditionals: {
          title: 'Array of conditionals',
          type: 'array',
          items: {
            $ref: '#/definitions/person'
          }
        },
        fixedArrayOfConditionals: {
          title: 'Fixed array of conditionals',
          type: 'array',
          items: [
            {
              title: 'Primary person',
              $ref: '#/definitions/person'
            }
          ],
          additionalItems: {
            title: 'Additional person',
            $ref: '#/definitions/person'
          }
        }
      },
      definitions: {
        person: {
          title: 'Person',
          type: 'object',
          properties: {
            'Do you have any pets?': {
              type: 'string',
              // enum: ['No', 'Yes: One', 'Yes: More than one'],
              enum: ['0', '1', '2'],
              default: '0'
            }
          },
          required: ['Do you have any pets?'],
          dependencies: {
            'Do you have any pets?': {
              oneOf: [
                {
                  properties: {
                    'Do you have any pets?': {
                      enum: ['0']
                    }
                  }
                },
                {
                  properties: {
                    'Do you have any pets?': {
                      enum: ['1']
                    },
                    'How old is your pet?': {
                      type: 'number'
                    }
                  },
                  required: ['How old is your pet?']
                },
                {
                  properties: {
                    'Do you have any pets?': {
                      enum: ['2']
                    },
                    'Do you want to get rid of any?': {
                      type: 'boolean'
                    }
                  },
                  required: ['Do you want to get rid of any?']
                }
              ]
            }
          }
        }
      }
    };
    const entries: Entries<string> = [
      ['root.simple.name', 'Randy'],
      ['root.simple.credit_card', ''],
      ['root.conditional.Do you have any pets?', '0'],
      ['root.arrayOfConditionals.0.Do you have any pets?', '1'],
      ['root.arrayOfConditionals.0.How old is your pet?', '6'],
      ['root.arrayOfConditionals.1.Do you have any pets?', '2'],
      ['root.arrayOfConditionals.1.Do you want to get rid of any?', '1'],
      ['root.fixedArrayOfConditionals.0.Do you have any pets?', '0'],
      ['root.fixedArrayOfConditionals.1.Do you have any pets?', '1'],
      ['root.fixedArrayOfConditionals.1.How old is your pet?', '6'],
      ['root.fixedArrayOfConditionals.2.Do you have any pets?', '2'],
      ['root.fixedArrayOfConditionals.2.Do you want to get rid of any?', '0']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
      conditional: {
        'Do you have any pets?': '0'
      },
      arrayOfConditionals: [
        {
          'Do you have any pets?': '1',
          'How old is your pet?': 6
        },
        {
          'Do you have any pets?': '2',
          'Do you want to get rid of any?': false
        }
      ],
      fixedArrayOfConditionals: [
        {
          'Do you have any pets?': '0'
        },
        {
          'Do you have any pets?': '1',
          'How old is your pet?': 6
        },
        {
          'Do you have any pets?': '2',
          'Do you want to get rid of any?': true
        }
      ],
      simple: {
        name: 'Randy'
      }
    });
  });
  it('Should parse schema with If/Then/Else', async () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        animal: {
          enum: ['0', '1']
        }
      },
      allOf: [
        {
          if: {
            properties: {
              animal: {
                const: '0'
              }
            }
          },
          then: {
            properties: {
              food: {
                type: 'string',
                enum: ['meat', 'grass', 'fish']
              }
            },
            required: ['food']
          }
        },
        {
          if: {
            properties: {
              animal: {
                const: '1'
              }
            }
          },
          then: {
            properties: {
              food: {
                type: 'string',
                enum: ['insect', 'worms']
              },
              water: {
                type: 'string',
                enum: ['lake', 'sea']
              }
            },
            required: ['food', 'water']
          }
        },
        {
          required: ['animal']
        }
      ]
    };
    const entries: Entries<string> = [
      ['root.animal', '1'],
      ['root.food', '0'],
      ['root.water', '1']
    ];
    await expect(parseSchemaValue(c.signal, opts({ schema, entries }))).resolves.toEqual({
      animal: '1',
      food: 'insect',
      water: 'sea'
    });
  });

  describe('with form data entries converter', async () => {
    it('Should convert form data entries', async () => {
      const schema: Schema = {
        definitions: {
          Thing: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                default: 'Default name'
              }
            }
          }
        },
        type: 'object',
        properties: {
          listOfStrings: {
            type: 'array',
            title: 'A list of strings',
            items: {
              type: 'string',
              default: 'bazinga'
            }
          },
          multipleChoicesList: {
            type: 'array',
            title: 'A multiple choices list',
            items: {
              type: 'string',
              enum: ['foo', 'bar', 'fuzz', 'qux']
            },
            uniqueItems: true
          },
          fixedItemsList: {
            type: 'array',
            title: 'A list of fixed items',
            items: [
              {
                title: 'A string value',
                type: 'string',
                default: 'lorem ipsum'
              },
              {
                title: 'a boolean value',
                type: 'boolean',
                enum: [true, false]
              }
            ],
            additionalItems: {
              title: 'Additional item',
              type: 'number'
            }
          },
          minItemsList: {
            type: 'array',
            title: 'A list with a minimal number of items',
            minItems: 3,
            items: {
              $ref: '#/definitions/Thing'
            }
          },
          defaultsAndMinItems: {
            type: 'array',
            title: 'List and item level defaults',
            minItems: 5,
            default: ['carp', 'trout', 'bream'],
            items: {
              type: 'string',
              default: 'unidentified'
            }
          },
          nestedList: {
            type: 'array',
            title: 'Nested list',
            items: {
              type: 'array',
              title: 'Inner list',
              items: {
                type: 'string',
                default: 'lorem ipsum'
              }
            }
          },
          unorderable: {
            title: 'Unorderable items',
            type: 'array',
            items: {
              type: 'string',
              default: 'lorem ipsum'
            }
          },
          copyable: {
            title: 'Copyable items',
            type: 'array',
            items: {
              type: 'string',
              default: 'lorem ipsum'
            }
          },
          unremovable: {
            title: 'Unremovable items',
            type: 'array',
            items: {
              type: 'string',
              default: 'lorem ipsum'
            }
          },
          noToolbar: {
            title: 'No add, remove and order buttons',
            type: 'array',
            items: {
              type: 'string',
              default: 'lorem ipsum'
            }
          },
          fixedNoToolbar: {
            title: 'Fixed array without buttons',
            type: 'array',
            items: [
              {
                title: 'A number',
                type: 'number',
                default: 42
              },
              {
                title: 'A boolean',
                type: 'boolean',
                default: false
              }
            ],
            additionalItems: {
              title: 'A string',
              type: 'string',
              default: 'lorem ipsum'
            }
          }
        }
      };
      const entries: Entries<string> = [
        ['root.listOfStrings.0', 'foo'],
        ['root.listOfStrings.1', 'bar'],
        ['root.multipleChoicesList', '0'],
        ['root.multipleChoicesList', '1'],
        ['root.fixedItemsList.0', 'Some text'],
        ['root.fixedItemsList.1', '0'],
        ['root.fixedItemsList.2', '123'],
        ['root.minItemsList.0.name', 'Default name'],
        ['root.minItemsList.1.name', 'Default name'],
        ['root.minItemsList.2.name', 'Default name'],
        ['root.defaultsAndMinItems.0', 'carp'],
        ['root.defaultsAndMinItems.1', 'trout'],
        ['root.defaultsAndMinItems.2', 'bream'],
        ['root.defaultsAndMinItems.3', 'unidentified'],
        ['root.defaultsAndMinItems.4', 'unidentified'],
        ['root.nestedList.0.0', 'lorem'],
        ['root.nestedList.0.1', 'ipsum'],
        ['root.nestedList.1.0', 'dolor'],
        ['root.unorderable.0', 'one'],
        ['root.unorderable.1', 'two'],
        ['root.copyable.0', 'one'],
        ['root.copyable.1', 'two'],
        ['root.unremovable.0', 'one'],
        ['root.unremovable.1', 'two'],
        ['root.noToolbar.0', 'one'],
        ['root.noToolbar.1', 'two'],
        ['root.fixedNoToolbar.0', '42'],
        ['root.fixedNoToolbar.1', 'on'],
        ['root.fixedNoToolbar.2', 'additional item one'],
        ['root.fixedNoToolbar.3', 'additional item two']
      ];
      await expect(
        parseSchemaValue(
          c.signal,
          opts({
            schema,
            entries
          })
        )
      ).resolves.toEqual({
        listOfStrings: ['foo', 'bar'],
        multipleChoicesList: ['foo', 'bar'],
        fixedItemsList: ['Some text', true, 123],
        minItemsList: [
          {
            name: 'Default name'
          },
          {
            name: 'Default name'
          },
          {
            name: 'Default name'
          }
        ],
        defaultsAndMinItems: ['carp', 'trout', 'bream', 'unidentified', 'unidentified'],
        nestedList: [['lorem', 'ipsum'], ['dolor']],
        unorderable: ['one', 'two'],
        copyable: ['one', 'two'],
        unremovable: ['one', 'two'],
        noToolbar: ['one', 'two'],
        fixedNoToolbar: [42, true, 'additional item one', 'additional item two']
      });
    });
  });
});

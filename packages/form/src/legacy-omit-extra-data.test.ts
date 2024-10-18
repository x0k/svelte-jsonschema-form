// This file contains content from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/core/test/Form.test.jsx
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { describe, expect, it, beforeEach } from 'vitest';

import { omitExtraData, getFieldNames, getUsedFormData } from './legacy-omit-extra-data.js'
import type { Validator } from './core/validator.js';
import { makeTestValidator } from './core/test-validator.js';
import type { Schema, SchemaArrayValue } from './core/schema.js';

let validator: Validator

beforeEach(() => {
  validator = makeTestValidator()
})

describe('omitExtraData', () => {

  it("Should omit extra data", () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
      },
    };
    const formData = { foo: 'bar', baz: 'baz' };
    expect(omitExtraData(validator, schema, formData)).eql({ foo: 'bar' });
  })

  describe('getUsedFormData', () => {
    it('should just return the single input form value', () => {
      const schema = {
        title: 'A single-field form',
        type: 'string',
      };
      const formData = 'foo';

      expect(getUsedFormData(formData, [])).toEqual('foo');
    });

    it('should return the root level array', () => {
      const formData: SchemaArrayValue = [];
      expect(getUsedFormData(formData, [])).toEqual(formData);
    });

    it('should call getUsedFormData with data from fields in event', () => {
      const formData = {
        foo: 'bar',
      };
      expect(getUsedFormData(formData, ['foo'])).toEqual({ foo: 'bar' });
    });

    it('unused form values should be omitted', () => {
      const formData = {
        foo: 'bar',
        baz: 'buzz',
        list: [
          { title: 'title0', details: 'details0' },
          { title: 'title1', details: 'details1' },
        ],
      };
      expect(getUsedFormData(formData, ['foo', 'list.0.title', 'list.1.details'])).toEqual({
        foo: 'bar',
        list: [{ title: 'title0' }, { details: 'details1' }],
      });
    });
  });

  describe('getFieldNames()', () => {
    it('should return an empty array for a single input form', () => {
      const formData = 'foo';
      const pathSchema = {
        $name: '',
      };
      expect(getFieldNames(pathSchema, formData)).toEqual([]);
    });

    it('should get field names from pathSchema', () => {
      const formData = {
        extra: {
          foo: 'bar',
        },
        level1: {
          level2: 'test',
          anotherThing: {
            anotherThingNested: 'abc',
            extra: 'asdf',
            anotherThingNested2: 0,
          },
          stringArray: ['scobochka'],
        },
        level1a: 1.23,
      };

      const pathSchema = {
        $name: '',
        level1: {
          $name: 'level1',
          level2: { $name: 'level1.level2' },
          anotherThing: {
            $name: 'level1.anotherThing',
            anotherThingNested: {
              $name: 'level1.anotherThing.anotherThingNested',
            },
            anotherThingNested2: {
              $name: 'level1.anotherThing.anotherThingNested2',
            },
          },
          stringArray: {
            $name: 'level1.stringArray',
          },
        },
        level1a: {
          $name: 'level1a',
        },
      };

      expect(getFieldNames(pathSchema, formData).sort()).toEqual(
        [
          ['level1', 'anotherThing', 'anotherThingNested'],
          ['level1', 'anotherThing', 'anotherThingNested2'],
          ['level1', 'level2'],
          ['level1', 'stringArray'],
          ['level1a'],
        ].sort()
      );
    });

    it('should get field marked as additionalProperties', () => {
      const formData = {
        extra: {
          foo: 'bar',
        },
        level1: {
          level2: 'test',
          extra: 'foo',
          mixedMap: {
            namedField: 'foo',
            key1: 'val1',
          },
        },
        level1a: 1.23,
      };

      const pathSchema = {
        $name: '',
        level1: {
          $name: 'level1',
          level2: { $name: 'level1.level2' },
          mixedMap: {
            $name: 'level1.mixedMap',
            __sjsf_additionalProperties: true,
            namedField: { $name: 'level1.mixedMap.namedField' }, // this name should not be returned, as the root object paths should be returned for objects marked with additionalProperties
          },
        },
        level1a: {
          $name: 'level1a',
        },
      };

      expect(getFieldNames(pathSchema, formData).sort()).toEqual([['level1', 'level2'], 'level1.mixedMap', ['level1a']].sort());
    });

    it('should get field names from pathSchema with array', () => {
      const formData = {
        address_list: [
          {
            street_address: '21, Jump Street',
            city: 'Babel',
            state: 'Neverland',
          },
          {
            street_address: '1234 Schema Rd.',
            city: 'New York',
            state: 'Arizona',
          },
        ],
      };

      const pathSchema = {
        $name: '',
        address_list: {
          0: {
            $name: 'address_list.0',
            city: {
              $name: 'address_list.0.city',
            },
            state: {
              $name: 'address_list.0.state',
            },
            street_address: {
              $name: 'address_list.0.street_address',
            },
          },
          1: {
            $name: 'address_list.1',
            city: {
              $name: 'address_list.1.city',
            },
            state: {
              $name: 'address_list.1.state',
            },
            street_address: {
              $name: 'address_list.1.street_address',
            },
          },
        },
      };

      expect(getFieldNames(pathSchema, formData).sort()).toEqual(
        [
          ['address_list', '0', 'city'],
          ['address_list', '0', 'state'],
          ['address_list', '0', 'street_address'],
          ['address_list', '1', 'city'],
          ['address_list', '1', 'state'],
          ['address_list', '1', 'street_address'],
        ].sort()
      );
    });
  });

  it('should omit extra data 2', () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: { type: 'string' },
      },
    };
    const formData = { foo: 'foo', baz: 'baz' };
    expect(omitExtraData(validator, schema, formData)).toEqual({ foo: 'foo' });
  });

  it('should not omit additionalProperties', () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        bar: { type: 'string' },
        add: {
          type: 'object',
          additionalProperties: {},
        },
      },
    };
    const formData = { foo: 'foo', baz: 'baz', add: { prop: 123 } };
    expect(omitExtraData(validator, schema, formData)).toEqual({ foo: 'foo', add: { prop: 123 } })
  });

  it('should rename formData key if key input is renamed in a nested object', () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        nested: {
          additionalProperties: { type: 'string' },
        },
      },
    }
    const formData = { nested: { key1: 'value' } }

    expect(omitExtraData(validator, schema, formData)).toEqual({ nested: { key1: 'value' } })
  });

  it('should allow oneOf data entry', () => {
    const schema: Schema = {
          type: 'object',
          oneOf: [
            {
              properties: {
                lorem: {
                  type: 'string',
                },
              },
              required: ['lorem'],
            },
            {
              properties: {
                ipsum: {
                  type: 'string',
                },
              },
              required: ['ipsum'],
            },
          ],
        }
    const formData = { lorum: '', lorem: "foo" }
    
    expect(omitExtraData(validator, schema, formData)).toEqual({ lorem: "foo" })
  });

  it('should allow anyOf data entry', () => {
    const schema: Schema = {
      type: 'object',
      anyOf: [
        {
          properties: {
            lorem: {
              type: 'string',
            },
          },
          required: ['lorem'],
        },
        {
          properties: {
            ipsum: {
              type: 'string',
            },
          },
          required: ['ipsum'],
        },
      ],
    }
    const formData = { ipsum: '' }

    expect(omitExtraData(validator, schema, formData)).toEqual({ ipsum: '' })
  });
});

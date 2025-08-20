// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/getOptionMatchingSimpleDiscriminator.test.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/getDiscriminatorFieldFromSchema.test.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { describe, expect, it, test } from 'vitest';

import { getDiscriminatorFieldFromSchema, getOptionMatchingSimpleDiscriminator } from './discriminator.js';
import type { Schema } from './schema.js';

const PROPERTY_NAME = 'testProp';
// const BAD_DISCRIMINATOR: Schema = { discriminator: { propertyName: 5 } };
const GOOD_DISCRIMINATOR: Schema = { discriminator: { propertyName: PROPERTY_NAME } };

describe('getDiscriminatorFieldFromSchema()', () => {
  it('returns undefined when no discriminator is present', () => {
    expect(getDiscriminatorFieldFromSchema({})).toBeUndefined();
  });
  it('returns the propertyName when discriminator is present', () => {
    expect(getDiscriminatorFieldFromSchema(GOOD_DISCRIMINATOR)).toEqual(PROPERTY_NAME);
  });
  // describe('bad discriminator', () => {
  //   let consoleWarnSpy: MockInstance<typeof console.warn>;
  //   beforeAll(() => {
  //     consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {}); // mock this to avoid actually warning in the tests
  //   });
  //   afterAll(() => {
  //     consoleWarnSpy.mockRestore();
  //   });
  //   it('returns undefined when discriminator is present, but not a string', () => {
  //     expect(getDiscriminatorFieldFromSchema(BAD_DISCRIMINATOR)).toBeUndefined();
  //   });
  //   it('it also warns about the bad discriminator', () => {
  //     expect(consoleWarnSpy).toHaveBeenCalledWith('Expecting discriminator to be a string, got "number" instead');
  //   });
  // });
});

describe('getOptionMatchingSimpleDiscriminator()', () => {
  describe('returns undefined if no option matches discriminator', () => {
    test('no options with no data', () => {
      expect(getOptionMatchingSimpleDiscriminator({}, [], 'id')).toEqual(undefined);
    });

    test('no options with data', () => {
      expect(getOptionMatchingSimpleDiscriminator({ foo: 'foo' }, [], 'id')).toEqual(undefined);
    });

    test('options with no data', () => {
      expect(
        getOptionMatchingSimpleDiscriminator({}, [{ type: 'object', properties: { foo: { const: 'foo' } } }], 'id')
      ).toEqual(undefined);
    });

    test('matching property, but no discriminatorField', () => {
      expect(
        getOptionMatchingSimpleDiscriminator({ foo: 'foo' }, [
          { type: 'object', properties: { foo: { const: 'foo' } } },
        ])
      ).toEqual(undefined);
    });

    test('matching property different from discriminatorField', () => {
      expect(
        getOptionMatchingSimpleDiscriminator(
          { foo: 'foo' },
          [{ type: 'object', properties: { foo: { const: 'foo' } } }],
          'bar'
        )
      ).toEqual(undefined);
    });
  });

  describe('returns option index if option matches discriminator', () => {
    test('const discriminator', () => {
      expect(
        getOptionMatchingSimpleDiscriminator(
          { foo: 'foo' },
          [{}, { type: 'object', properties: { foo: { const: 'foo' } } }],
          'foo'
        )
      ).toEqual(1);
    });

    test('enum discriminator', () => {
      expect(
        getOptionMatchingSimpleDiscriminator(
          { foo: 'foo' },
          [{}, { type: 'object', properties: { foo: { enum: ['bar', 'foo'] } } }],
          'foo'
        )
      ).toEqual(1);
    });
  });

  describe('unsupported (non-simple) discriminator returns undefined', () => {
    test('object discriminator', () => {
      expect(
        getOptionMatchingSimpleDiscriminator(
          { foo: 'foo' },
          [{}, { type: 'object', properties: { foo: { type: 'object' } } }],
          'foo'
        )
      ).toEqual(undefined);
    });

    test('array discriminator', () => {
      expect(
        getOptionMatchingSimpleDiscriminator(
          { foo: 'foo' },
          [{}, { type: 'object', properties: { foo: { type: 'array' } } }],
          'foo'
        )
      ).toEqual(undefined);
    });
  });
});
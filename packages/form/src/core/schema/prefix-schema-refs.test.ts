// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/withIdRef.test.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { describe, expect, it } from 'vitest';

import { ROOT_SCHEMA_PREFIX, type Schema } from './schema';
import { prefixSchemaRefs } from './prefix-schema-refs';

describe('prefixSchemaRefs()', () => {
  it('should recursively add id prefix to all refs', () => {
    const schema: Schema = {
      anyOf: [{ $ref: '#/defs/foo' }],
    };
    const expected = {
      anyOf: [{ $ref: '__sjsf_rootSchema#/defs/foo' }],
    };

    expect(prefixSchemaRefs(schema, ROOT_SCHEMA_PREFIX)).toEqual(expected);
  });
  it('shouldn`t mutate the schema', () => {
    const schema: Schema = {
      anyOf: [{ $ref: '#/defs/foo' }],
    };

    prefixSchemaRefs(schema, ROOT_SCHEMA_PREFIX);

    expect(schema).toEqual({
      anyOf: [{ $ref: '#/defs/foo' }],
    });
  });
  it('should not change a property named `$ref`', () => {
    const schema: Schema = {
      title: 'A registration form',
      description: 'A simple form example.',
      type: 'object',
      properties: {
        $ref: { type: 'string', title: 'First name', default: 'Chuck' },
      },
    };

    expect(prefixSchemaRefs(schema, ROOT_SCHEMA_PREFIX)).toEqual(schema);
  });
  // it('should handle null schemaNode', () => {
  //   const schemaNode = null;
  //   expect(prefixSchemaRefs(schemaNode, ROOT_SCHEMA_PREFIX)).toEqual(schemaNode);
  // });
});

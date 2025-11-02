import { beforeEach, describe, expect, test } from 'vitest';

import {
  DEFAULT_INDEX_SEPARATOR,
  DEFAULT_PROPERTY_SEPARATOR,
  DEFAULT_PSEUDO_SEPARATOR
} from '../id-builder.js';
import { createCodec, DEFAULT_ESCAPE_CHAR } from './codec.js';

describe('createCodec', () => {
  let codec: ReturnType<typeof createCodec>;

  beforeEach(() => {
    codec = createCodec({
      escapeChar: DEFAULT_ESCAPE_CHAR,
      sequencesToEncode: [
        DEFAULT_PROPERTY_SEPARATOR,
        DEFAULT_INDEX_SEPARATOR,
        DEFAULT_PSEUDO_SEPARATOR
      ]
    });
  });

  describe('encode', () => {
    test('encodes escape char', () => {
      expect(codec.encode('foo~bar')).toBe('foo~23ibar');
    });
    test('encodes separators', () => {
      expect(
        codec.encode(
          `foo${DEFAULT_PROPERTY_SEPARATOR}bar${DEFAULT_INDEX_SEPARATOR}baz${DEFAULT_PSEUDO_SEPARATOR}gas`
        )
      ).toBe('foo~21abar~21sbaz~41m1mgas');
    });
  });

  describe('decode', () => {
    test('decodes escape char', () => {
      expect(codec.decode('foo~23ibar')).toBe('foo~bar');
    });
    test('decodes separators', () => {
      expect(codec.decode('foo~21abar~21sbaz~41m1mgas')).toBe(
        `foo${DEFAULT_PROPERTY_SEPARATOR}bar${DEFAULT_INDEX_SEPARATOR}baz${DEFAULT_PSEUDO_SEPARATOR}gas`
      );
    });
  });
});

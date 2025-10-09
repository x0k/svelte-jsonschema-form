import { describe, test, expect } from 'vitest';

import { encode, decode } from './codec.js';

function isValidFormName(name: string): boolean {
  const path_regex = /^[a-zA-Z_$]\w*(\.[a-zA-Z_$]\w*|\[\d+\])*$/;
  return path_regex.test(name);
}

describe('encodeFormName with base-36', () => {
  test('encodes simple ASCII names with special characters', () => {
    const encoded1 = encode('user-name');
    const encoded2 = encode('email@domain');

    expect(isValidFormName(encoded1)).toBe(true);
    expect(isValidFormName(encoded2)).toBe(true);
    expect(decode(encoded1)).toBe('user-name');
    expect(decode(encoded2)).toBe('email@domain');
  });

  test('handles X character - always encoded', () => {
    // X must always be encoded to avoid ambiguity
    expect(encode('Xavier')).toBe('X22gavier');
    expect(encode('userXname')).toBe('userX22gname');
    expect(encode('XXXX')).toBe('X22gX22gX22gX22g');

    expect(decode('X22gavier')).toBe('Xavier');
    expect(decode('userX22gname')).toBe('userXname');
    expect(decode('X22gX22gX22gX22g')).toBe('XXXX');
  });

  test('handles special first character (digits)', () => {
    const tests = ['123abc', '9test', '0start'];
    tests.forEach((original) => {
      const encoded = encode(original);
      expect(decode(encoded)).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('preserves valid characters except X', () => {
    expect(encode('validName123')).toBe('validName123');
    expect(encode('$dollarSign')).toBe('$dollarSign');
    expect(encode('_privateVar')).toBe('_privateVar');
    expect(encode('camelCase')).toBe('camelCase');
    // X is always encoded
    expect(encode('Xavier123')).toBe('X22gavier123');
  });

  test('handles UTF-8 characters', () => {
    const tests = ['café', 'użytkownik', 'naïve', 'Zürich'];
    tests.forEach((original) => {
      const encoded = encode(original);
      expect(decode(encoded)).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('handles emojis', () => {
    const tests = ['user😀name', '🎉', '😀🎉'];
    tests.forEach((original) => {
      const encoded = encode(original);
      expect(decode(encoded)).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('edge cases', () => {
    expect(encode('')).toBe('');
    expect(encode('a')).toBe('a');
    expect(decode('')).toBe('');
    expect(decode('a')).toBe('a');
  });

  test('base-36 encoding examples', () => {
    // Dash (45 in decimal = '19' in base-36)
    expect(encode('a-b')).toBe('aX219b');

    // Space (32 in decimal = 'w' in base-36)
    expect(encode('a b')).toBe('aX1wb');

    // @ (64 in decimal = '1s' in base-36)
    expect(encode('a@b')).toBe('aX21sb');
  });
});

describe('decodeFormName with base-36', () => {
  test('decodes encoded names back to original', () => {
    const tests = ['user-name', 'email@domain', 'with spaces', 'special!chars#here'];

    tests.forEach((original) => {
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
    });
  });

  test('handles literal X characters correctly', () => {
    // X is always encoded, never literal in the output
    expect(decode('X22gavier')).toBe('Xavier');
    expect(decode('X22gX22gX22g')).toBe('XXX');
    expect(decode('testX22gvalue')).toBe('testXvalue');
  });

  test('preserves unencoded characters', () => {
    expect(decode('validName123')).toBe('validName123');
  });
});

describe('round-trip encoding/decoding', () => {
  test('round trips simple strings', () => {
    const tests = [
      'user-name',
      'email@domain.com',
      'with spaces',
      'tab\there',
      'newline\nhere',
      'special!@#$%^&*()'
    ];

    tests.forEach((original) => {
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with X character', () => {
    const tests = ['X marks the spot', 'XXXX', 'Xavier', 'aXb', 'X', 'XXXtest', 'testXXX'];

    tests.forEach((original) => {
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with special first characters', () => {
    const tests = ['123abc', '9test', '-start', '@mention', '!important', ' space'];

    tests.forEach((original) => {
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with Unicode characters', () => {
    const tests = ['café', 'naïve', 'Zürich', '你好', 'Привет', '😀🎉', 'użytkownik', '한글'];

    tests.forEach((original) => {
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with underscores and dollar signs', () => {
    const tests = ['_underscore', '$dollar', '_$mixed', 'var_name', '$_private'];

    tests.forEach((original) => {
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips all ASCII printable characters', () => {
    for (let code = 32; code <= 126; code++) {
      const char = String.fromCharCode(code);
      const testStr = `a${char}b`;
      const encoded = encode(testStr);
      const decoded = decode(encoded);
      expect(decoded).toBe(testStr);
      expect(isValidFormName(encoded)).toBe(true);
    }
  });

  test('round trips mixed valid and invalid characters', () => {
    const tests = ['validXinvalid-chars', 'X123X456', 'test_X_test', 'a-b-c-X-d-e'];

    tests.forEach((original) => {
      const encoded = encode(original);
      const decoded = decode(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });
});

describe('isValidFormName', () => {
  test('validates encoded names', () => {
    const names = [
      'user-name',
      'email@domain.com',
      'Xavier',
      '123abc',
      'with spaces',
      'café',
      '😀'
    ];

    names.forEach((name) => {
      const encoded = encode(name);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('rejects invalid names', () => {
    expect(isValidFormName('123invalid')).toBe(false);
    expect(isValidFormName('user-name')).toBe(false);
    expect(isValidFormName('user@email')).toBe(false);
    expect(isValidFormName('')).toBe(false);
  });

  test('accepts valid names', () => {
    expect(isValidFormName('validName')).toBe(true);
    expect(isValidFormName('_private')).toBe(true);
    expect(isValidFormName('$dollar')).toBe(true);
    expect(isValidFormName('name123')).toBe(true);
    // X by itself in output means it's part of an escape sequence
    expect(isValidFormName('X22gavier')).toBe(true);
  });
});

describe('base-36 encoding efficiency', () => {
  test('produces compact encodings', () => {
    const examples = [
      { char: '-', code: 45, expected: 'X219' }, // 45 in base-36 = '19', length 2
      { char: '@', code: 64, expected: 'X21s' }, // 64 in base-36 = '1s', length 2
      { char: ' ', code: 32, expected: 'X1w' } // 32 in base-36 = 'w', length 1
    ];

    examples.forEach(({ char, expected }) => {
      const encoded = encode(char);
      expect(encoded).toBe(expected);
      expect(decode(encoded)).toBe(char);
    });
  });

  test('handles large Unicode values', () => {
    const emoji = '😀'; // U+1F600 (128512)
    const encoded = encode(emoji);

    expect(decode(encoded)).toBe(emoji);
    expect(isValidFormName(encoded)).toBe(true);
  });
});

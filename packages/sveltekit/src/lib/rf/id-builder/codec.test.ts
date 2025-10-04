import { describe, test, expect } from 'vitest';
import { encodeFormName, decodeFormName } from './codec.js';

function isValidFormName(name: string): boolean {
  const path_regex = /^[a-zA-Z_$]\w*(\.[a-zA-Z_$]\w*|\[\d+\])*$/;
  return path_regex.test(name);
}

describe('encodeFormName with base-36', () => {
  test('encodes simple ASCII names with special characters', () => {
    const encoded1 = encodeFormName('user-name');
    const encoded2 = encodeFormName('email@domain');
    
    console.log('user-name ->', encoded1);
    console.log('email@domain ->', encoded2);
    
    expect(isValidFormName(encoded1)).toBe(true);
    expect(isValidFormName(encoded2)).toBe(true);
    expect(decodeFormName(encoded1)).toBe('user-name');
    expect(decodeFormName(encoded2)).toBe('email@domain');
  });

  test('handles X character - always encoded', () => {
    // X must always be encoded to avoid ambiguity
    expect(encodeFormName('Xavier')).toBe('X258avier');
    expect(encodeFormName('userXname')).toBe('userX258name');
    expect(encodeFormName('XXXX')).toBe('X258X258X258X258');
    
    expect(decodeFormName('X258avier')).toBe('Xavier');
    expect(decodeFormName('userX258name')).toBe('userXname');
    expect(decodeFormName('X258X258X258X258')).toBe('XXXX');
  });

  test('distinguishes between literal X in encoding and escape sequences', () => {
    // X (88) in base-36 is '2g', so encoded as X22g
    const encoded = encodeFormName('X');
    expect(encoded).toBe('X22g');
    expect(decodeFormName(encoded)).toBe('X');
    
    // x (120) in base-36 is '3c', so encoded as X23c
    const encodedLower = encodeFormName('x');
    expect(encodedLower).toBe('X23c');
    expect(decodeFormName(encodedLower)).toBe('x');
  });

  test('handles special first character (digits)', () => {
    const tests = ['123abc', '9test', '0start'];
    tests.forEach(original => {
      const encoded = encodeFormName(original);
      console.log(`${original} ->`, encoded);
      expect(decodeFormName(encoded)).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('preserves valid characters except X', () => {
    expect(encodeFormName('validName123')).toBe('validName123');
    expect(encodeFormName('$dollarSign')).toBe('$dollarSign');
    expect(encodeFormName('_privateVar')).toBe('_privateVar');
    expect(encodeFormName('camelCase')).toBe('camelCase');
    // X is always encoded
    expect(encodeFormName('Xavier123')).toBe('X258avier123');
  });

  test('handles UTF-8 characters', () => {
    const tests = ['café', 'użytkownik', 'naïve', 'Zürich'];
    tests.forEach(original => {
      const encoded = encodeFormName(original);
      expect(decodeFormName(encoded)).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('handles emojis', () => {
    const tests = ['user😀name', '🎉', '😀🎉'];
    tests.forEach(original => {
      const encoded = encodeFormName(original);
      console.log(`${original} ->`, encoded);
      expect(decodeFormName(encoded)).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('edge cases', () => {
    expect(encodeFormName('')).toBe('');
    expect(encodeFormName('a')).toBe('a');
    expect(decodeFormName('')).toBe('');
    expect(decodeFormName('a')).toBe('a');
  });

  test('base-36 encoding examples', () => {
    // Dash (45 in decimal = '19' in base-36)
    expect(encodeFormName('a-b')).toBe('aX219b');
    
    // Space (32 in decimal = 'w' in base-36)
    expect(encodeFormName('a b')).toBe('aX1wb');
    
    // @ (64 in decimal = '1o' in base-36)
    expect(encodeFormName('a@b')).toBe('aX21ob');
  });
});

describe('decodeFormName with base-36', () => {
  test('decodes encoded names back to original', () => {
    const tests = [
      'user-name',
      'email@domain',
      'with spaces',
      'special!chars#here'
    ];

    tests.forEach(original => {
      const encoded = encodeFormName(original);
      const decoded = decodeFormName(encoded);
      expect(decoded).toBe(original);
    });
  });

  test('handles literal X characters correctly', () => {
    // X is always encoded, never literal in the output
    expect(decodeFormName('X258avier')).toBe('Xavier');
    expect(decodeFormName('X258X258X258')).toBe('XXX');
    expect(decodeFormName('testX258value')).toBe('testXvalue');
  });

  test('preserves unencoded characters', () => {
    expect(decodeFormName('validName123')).toBe('validName123');
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

    tests.forEach(original => {
      const encoded = encodeFormName(original);
      const decoded = decodeFormName(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with X character', () => {
    const tests = [
      'X marks the spot',
      'XXXX',
      'Xavier',
      'aXb',
      'X',
      'XXXtest',
      'testXXX'
    ];

    tests.forEach(original => {
      const encoded = encodeFormName(original);
      const decoded = decodeFormName(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with special first characters', () => {
    const tests = [
      '123abc',
      '9test',
      '-start',
      '@mention',
      '!important',
      ' space'
    ];

    tests.forEach(original => {
      const encoded = encodeFormName(original);
      const decoded = decodeFormName(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with Unicode characters', () => {
    const tests = [
      'café',
      'naïve',
      'Zürich',
      '你好',
      'Привет',
      '😀🎉',
      'użytkownik',
      '한글'
    ];

    tests.forEach(original => {
      const encoded = encodeFormName(original);
      const decoded = decodeFormName(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips with underscores and dollar signs', () => {
    const tests = [
      '_underscore',
      '$dollar',
      '_$mixed',
      'var_name',
      '$_private'
    ];

    tests.forEach(original => {
      const encoded = encodeFormName(original);
      const decoded = decodeFormName(encoded);
      expect(decoded).toBe(original);
      expect(isValidFormName(encoded)).toBe(true);
    });
  });

  test('round trips all ASCII printable characters', () => {
    for (let code = 32; code <= 126; code++) {
      const char = String.fromCharCode(code);
      const testStr = `a${char}b`;
      const encoded = encodeFormName(testStr);
      const decoded = decodeFormName(encoded);
      expect(decoded).toBe(testStr);
      expect(isValidFormName(encoded)).toBe(true);
    }
  });

  test('round trips mixed valid and invalid characters', () => {
    const tests = [
      'validXinvalid-chars',
      'X123X456',
      'test_X_test',
      'a-b-c-X-d-e'
    ];

    tests.forEach(original => {
      const encoded = encodeFormName(original);
      const decoded = decodeFormName(encoded);
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

    names.forEach(name => {
      const encoded = encodeFormName(name);
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
    expect(isValidFormName('X258avier')).toBe(true);
  });
});

describe('base-36 encoding efficiency', () => {
  test('produces compact encodings', () => {
    const examples = [
      { char: '-', code: 45, expected: 'X219' }, // 45 in base-36 = '19', length 2
      { char: '@', code: 64, expected: 'X21o' }, // 64 in base-36 = '1o', length 2
      { char: ' ', code: 32, expected: 'X1w' }   // 32 in base-36 = 'w', length 1
    ];

    examples.forEach(({ char, code, expected }) => {
      const encoded = encodeFormName(char);
      console.log(`'${char}' (${code}) -> ${encoded}`);
      expect(encoded).toBe(expected);
      expect(decodeFormName(encoded)).toBe(char);
    });
  });

  test('handles large Unicode values', () => {
    const emoji = '😀'; // U+1F600 (128512)
    const encoded = encodeFormName(emoji);
    console.log(`Emoji: ${emoji} (${emoji.charCodeAt(0)}) -> ${encoded}`);
    
    expect(decodeFormName(encoded)).toBe(emoji);
    expect(isValidFormName(encoded)).toBe(true);
  });
});
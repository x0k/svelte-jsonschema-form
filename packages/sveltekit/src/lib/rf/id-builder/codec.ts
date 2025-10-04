const RADIX = 36; // Maximum radix supported by toString/parseInt (0-9, a-z)

const FIRST_CHAR_REGEXP = /[a-zA-Z_$]/;
const CHAR_REGEXP = /[a-zA-Z0-9_]/;

const ESCAPE_CHAR = 'X';

export function encode(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const needsEncoding =
      char === ESCAPE_CHAR || (i === 0 ? !FIRST_CHAR_REGEXP.test(char) : !CHAR_REGEXP.test(char));
    if (needsEncoding) {
      const code = char.codePointAt(0)!;
      const codeStr = code.toString(RADIX);
      const len = codeStr.length.toString(RADIX);
      result += `${ESCAPE_CHAR}${len}${codeStr}`;
      if (code > 0xffff) {
        i++;
      }
    } else {
      result += char;
    }
  }
  return result;
}

export function decode(encoded: string): string {
  let i = 0;
  let result = '';
  while (i < encoded.length) {
    const char = encoded[i];
    const codeStart = i + 2;
    if (char === ESCAPE_CHAR && codeStart < encoded.length) {
      const lengthChar = encoded[i + 1];
      const codeLength = parseInt(lengthChar, RADIX);
      const codeEnd = codeStart + codeLength;
      if (!isNaN(codeLength) && codeLength >= 1 && codeEnd <= encoded.length) {
        const code = encoded.slice(codeStart, codeEnd);
        const codeInt = parseInt(code, RADIX);
        if (!isNaN(codeInt)) {
          result += String.fromCodePoint(codeInt);
          i = codeEnd;
          continue;
        }
      }
      throw new Error(`Invalid encoding "${encoded}"`);
    }
    result += char;
    i++;
  }
  return result;
}

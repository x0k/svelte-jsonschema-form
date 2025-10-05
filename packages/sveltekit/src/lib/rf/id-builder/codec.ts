const RADIX = 36; // Maximum radix supported by toString/parseInt (0-9, a-z)

const FIRST_CHAR_REGEXP = /[a-zA-Z_$]/;
const CHAR_REGEXP = /[a-zA-Z0-9_]/;

const ESCAPE_CHAR = 'X';

const parts: string[] = [];

export function encode(str: string): string {
  parts.length = 0;
  let chunkStart = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const needsEncoding =
      char === ESCAPE_CHAR || (i === 0 ? !FIRST_CHAR_REGEXP.test(char) : !CHAR_REGEXP.test(char));

    if (needsEncoding) {
      if (i > chunkStart) {
        parts.push(str.slice(chunkStart, i));
      }

      const code = char.codePointAt(0)!;
      const codeStr = code.toString(RADIX);
      const len = codeStr.length.toString(RADIX);
      parts.push(`${ESCAPE_CHAR}${len}${codeStr}`);

      if (code > 0xffff) {
        i++;
      }

      chunkStart = i + 1;
    }
  }

  if (chunkStart === 0) {
    return str;
  }
  if (chunkStart < str.length) {
    parts.push(str.slice(chunkStart));
  }
  return parts.join('');
}

export function decode(encoded: string): string {
  parts.length = 0;
  let chunkStart = 0;
  let i = 0;

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
          if (i > chunkStart) {
            parts.push(encoded.slice(chunkStart, i));
          }

          parts.push(String.fromCodePoint(codeInt));
          i = codeEnd;
          chunkStart = i;
          continue;
        }
      }
      throw new Error(`Invalid encoding "${encoded}"`);
    }
    i++;
  }

  if (chunkStart === 0) {
    return encoded;
  }
  if (chunkStart < encoded.length) {
    parts.push(encoded.slice(chunkStart));
  }
  return parts.join('');
}

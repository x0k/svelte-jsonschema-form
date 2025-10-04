const RADIX = 36; // Maximum radix supported by toString/parseInt (0-9, a-z)

const FIRST_CHAR_REGEXP = /[a-zA-Z_$]/;
const CHAR_REGEXP = /[a-zA-Z0-9_]/;

export function encodeFormName(str: string): string {
  if (!str) return '';

  let result = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const needsEncoding =
      char === 'X' || (i === 0 ? !FIRST_CHAR_REGEXP.test(char) : !CHAR_REGEXP.test(char));
    if (needsEncoding) {
      const base36Code = char.charCodeAt(0).toString(RADIX);
      const base36Length = base36Code.length.toString(RADIX);
      result += `X${base36Length}${base36Code}`;
    } else {
      result += char;
    }
  }

  return result;
}

export function decodeFormName(encoded: string): string {
  if (!encoded) return '';

  let result = '';
  let i = 0;

  while (i < encoded.length) {
    const char = encoded[i];
    if (char === 'X' && i + 2 < encoded.length) {
      const lengthChar = encoded[i + 1];
      const codeLength = parseInt(lengthChar, RADIX);
      if (!isNaN(codeLength) && codeLength >= 1 && i + 2 + codeLength <= encoded.length) {
        const base36Code = encoded.slice(i + 2, i + 2 + codeLength);
        const charCode = parseInt(base36Code, RADIX);
        if (!isNaN(charCode)) {
          result += String.fromCharCode(charCode);
          i += 2 + codeLength;
          continue;
        }
      }
      throw new Error(`Invalid encoded name "${encoded}"`);
    }
    result += char;
    i++;
  }

  return result;
}

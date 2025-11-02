import { getNodeByShortestPrefix, insertValue } from '@sjsf/form/lib/trie';

const RADIX = 36; // Maximum radix supported by toString/parseInt (0-9, a-z)
const UTF16_MAX_SINGLE_UNIT = 0xffff;

export interface CodecOptions {
  escapeChar?: string;
  sequencesToEncode: string[];
}

export const DEFAULT_ESCAPE_CHAR = '~';

export function createCodec({ escapeChar = DEFAULT_ESCAPE_CHAR, sequencesToEncode }: CodecOptions) {
  const encodeBuffer: string[] = [];
  function encodeSequence(seq: string) {
    encodeBuffer.length = 0;
    encodeBuffer.push(escapeChar, '');
    let encodedLen = 0;
    let i = 0;
    while (i < seq.length) {
      const code = seq.codePointAt(i++)!;
      if (code > UTF16_MAX_SINGLE_UNIT) {
        i++;
      }
      const codeStr = code.toString(RADIX);
      encodedLen += codeStr.length;
      encodeBuffer.push(codeStr);
    }
    encodeBuffer[1] = encodedLen.toString(RADIX);
    return {
      value: encodeBuffer.join(''),
      originalLen: seq.length
    };
  }

  if (escapeChar.length > 1) {
    throw new Error(
      `invalid escape char: expected length 1, but got "${escapeChar}" (${escapeChar.length})`
    );
  }

  const encodedEscapeChar = encodeSequence(escapeChar);
  let trie = insertValue(undefined, escapeChar, encodedEscapeChar);
  const encodedToOriginal = new Map<string, string>();
  encodedToOriginal.set(encodedEscapeChar.value.slice(2), escapeChar);
  for (const seq of sequencesToEncode) {
    if (seq.length > 9) {
      throw new Error(
        `invalid encodable sequence: expected length < 10, but got "${seq.length}" (${seq.length})`
      );
    }
    const node = getNodeByShortestPrefix(trie, seq);
    if (node !== undefined) {
      throw new Error(
        `invalid encodable sequence: sequences should not include each other, but "${seq}" ${
          node.value === undefined ? 'is a prefix' : 'has prefix'
        }`
      );
    }
    const encodedSeq = encodeSequence(seq);
    trie = insertValue(trie, seq, encodedSeq);
    encodedToOriginal.set(encodedSeq.value.slice(2), seq);
  }
  const parts: string[] = [];

  return {
    encode(str: string): string {
      parts.length = 0;
      let chunkStart = 0;

      let i = 0;
      while (i < str.length) {
        const data = getNodeByShortestPrefix(trie, str.slice(i))?.value;
        if (data !== undefined) {
          if (i > chunkStart) {
            parts.push(str.slice(chunkStart, i));
          }
          parts.push(data.value);
          i += data.originalLen;
          chunkStart = i;
        } else {
          i += str.codePointAt(i)! > UTF16_MAX_SINGLE_UNIT ? 2 : 1;
        }
      }

      if (chunkStart === 0) {
        return str;
      }
      if (chunkStart < str.length) {
        parts.push(str.slice(chunkStart));
      }
      return parts.join('');
    },
    decode(encoded: string): string {
      parts.length = 0;
      let chunkStart = 0;
      let i = 0;

      while (i < encoded.length) {
        const char = encoded[i];
        const codeStart = i + 2;

        if (char === escapeChar && codeStart < encoded.length) {
          const lenChar = encoded[i + 1];
          const codeLen = parseInt(lenChar, RADIX);
          const codeEnd = codeStart + codeLen;

          if (!isNaN(codeLen) && codeLen >= 1 && codeEnd <= encoded.length) {
            const code = encoded.slice(codeStart, codeEnd);
            const decoded = encodedToOriginal.get(code);
            if (decoded !== undefined) {
              if (i > chunkStart) {
                parts.push(encoded.slice(chunkStart, i));
              }
              parts.push(decoded);
              i = codeEnd;
              chunkStart = i;
              continue;
            }
          }
          throw new Error(`Invalid encoding "${encoded}"`);
        }
        i += char.codePointAt(0)! > UTF16_MAX_SINGLE_UNIT ? 2 : 1;
      }

      if (chunkStart === 0) {
        return encoded;
      }
      if (chunkStart < encoded.length) {
        parts.push(encoded.slice(chunkStart));
      }
      return parts.join('');
    }
  };
}

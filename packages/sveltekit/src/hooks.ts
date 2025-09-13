import type { Transport } from '@sveltejs/kit';

export const transport: Transport = {
  File: {
    encode: (v) => v instanceof File && 'file',
    decode: () => undefined
  }
};

import { describe, expect, it } from 'vitest';
import { createFormValidator } from '@sjsf/ajv8-validator';

import { createFormHandler } from './server.js';
import { createFormMerger } from '@sjsf/form/mergers/modern';

describe('makeFormDataParser', () => {
  it('Should handle File objects', async () => {
    const formData = new FormData();
    formData.append('root', new File(['hello'], 'test.txt', { type: 'text/plain' }));
    const parse = createFormHandler({
      createValidator: createFormValidator,
      createMerger: createFormMerger,
      schema: {
        type: 'string',
        format: 'data-url'
      }
    });
    const c = new AbortController();
    const [, data] = await parse(c.signal, formData);
    expect(data).toBe('data:text/plain;name=test.txt;base64,aGVsbG8=');
  });
});

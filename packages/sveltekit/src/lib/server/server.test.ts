import { describe, expect, it } from 'vitest';
import { createFormValidator } from '@sjsf/ajv8-validator';
import { createFormMerger } from '@sjsf/form/mergers/modern';

import { createFormHandler } from './server.js';

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
  it('Should omit empty nameless file', async () => {
    const formData = new FormData()
    formData.append('root', new File([], '', { type: '' }));
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
    expect(data).toBe(undefined);
  })
});

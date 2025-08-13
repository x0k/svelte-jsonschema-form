import { describe, expect, it } from 'vitest';

import { makeFormDataParser } from './server.js';

describe('makeFormDataParser', () => {
  it('Should handle File objects', async () => {
    const formData = new FormData();
    formData.append('root', new File(['hello'], 'test.txt', { type: 'text/plain' }));
    const request = new Request('http://localhost', {
      method: 'POST',
      body: formData
    });
    const parse = makeFormDataParser({
      validator: {
        isValid: () => true
      }
    });
    const data = await parse({
      request,
      schema: {
        type: 'string'
      }
    });
    expect(data).toBe('data:text/plain;name=test.txt;base64,aGVsbG8=');
  });
});

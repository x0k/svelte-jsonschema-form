import { render } from 'svelte/server';
import type { Page } from '@sveltejs/kit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { InitialFormData, ValidatedFormData } from '$lib/model.js';

async function renderForm(page: Partial<Page>) {
  vi.doMock('$app/state', () => ({
    page
  }));
  const m = await import('./native-form.svelte');
  // Prevent async SSR
  const form = render(m.default);
  return form;
}

// TODO: Create an issue about broken SSR
// TODO: Enable this test as SSR will be fixes
describe.skip('native form SSR', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });
  it('should render initial values', async () => {
    const { body } = await renderForm({
      data: {
        form: {
          schema: { title: 'Schema title', type: 'string' },
          initialValue: 'initial value',
          initialErrors: [
            {
              path: [],
              message: 'error message'
            }
          ]
        } satisfies InitialFormData
      }
    });
    expect(body).toContain('Schema title');
    expect(body).toContain('initial value');
    expect(body).toContain('error message');
  });
  it('should render action result', async () => {
    const { body } = await renderForm({
      data: {
        form: {
          schema: { title: 'Schema title', type: 'string' },
          initialValue: 'initial value',
          initialErrors: [
            {
              path: [],
              message: 'error message'
            }
          ]
        } satisfies InitialFormData
      },
      form: {
        form: {
          idPrefix: 'root',
          isValid: false,
          sendData: true,
          data: 'validated value',
          errors: [
            {
              path: [],
              message: 'validation error message'
            }
          ]
        } satisfies ValidatedFormData<true>
      }
    });
    expect(body).toContain('Schema title');
    expect(body).toContain('validated value');
    expect(body).toContain('validation error message');
  });
  it('should display the initial values if the validation was successful', async () => {
    const { body } = await renderForm({
      data: {
        form: {
          schema: { title: 'Schema title', type: 'string' },
          initialValue: 'initial value',
          initialErrors: [
            {
              path: [],
              message: 'error message'
            }
          ]
        } satisfies InitialFormData
      },
      form: {
        form: {
          idPrefix: 'root',
          isValid: true,
          sendData: true,
          data: 'validated value',
          errors: [
            {
              path: [],
              message: 'validation error message'
            }
          ]
        } satisfies ValidatedFormData<true>
      }
    });
    expect(body).toContain('Schema title');
    expect(body).toContain('initial value');
    expect(body).toContain('error message');
  });
});
